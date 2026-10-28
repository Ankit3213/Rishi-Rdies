import { randomUUID } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { config } from '../config';
import { getCollections, type OtpChallenge, type PassengerUser } from '../db';
import { createOtpCode, hashOtp, hashPassword, otpMatches, verifyPassword } from './crypto';
import { OtpProviderError, sendOtp, verifyProviderOtp } from './otp-provider';

export const authRouter = Router();

const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
});
const mobileSchema = z.string().regex(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number.');
const emailSchema = z.email().trim().toLowerCase();
const passwordSchema = z.string().min(8).max(128);
const credentialsSchema = z.object({
  email: emailSchema,
  mobile: mobileSchema,
  password: passwordSchema,
  role: z.literal('passenger'),
});
const signupSchema = credentialsSchema.extend({
  name: z.string().trim().min(1).max(120),
});
const verifySchema = z.object({
  sessionId: z.uuid(),
  mobile: mobileSchema,
  otp: z.string().regex(/^[0-9]{6}$/),
});
const resendSchema = z.object({
  sessionId: z.uuid(),
  mobile: mobileSchema,
});
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

function validationError(message: string) {
  return { error: { code: 'VALIDATION_ERROR', message } };
}

async function startChallenge(user: PassengerUser) {
  const { otpChallenges } = await getCollections();
  const code = createOtpCode();
  const now = new Date();
  await otpChallenges.updateMany(
    { userId: user._id, consumedAt: null },
    { $set: { consumedAt: now } },
  );
  const challenge: OtpChallenge = {
    _id: randomUUID(),
    userId: user._id,
    mobile: user.mobile,
    codeHash: hashOtp(code, config.JWT_SECRET),
    expiresAt: new Date(now.getTime() + OTP_TTL_MS),
    attempts: 0,
    consumedAt: null,
    createdAt: now,
  };
  await otpChallenges.insertOne(challenge);

  try {
    await sendOtp(user.mobile);
  } catch {
    await otpChallenges.updateOne(
      { _id: challenge._id, consumedAt: null },
      { $set: { consumedAt: new Date() } },
    );
    throw new Error('OTP_DELIVERY_FAILED');
  }

  return {
    sessionId: challenge._id,
    mobile: user.mobile,
    role: user.role,
    maskedMobile: `******${user.mobile.slice(-4)}`,
    ...(config.OTP_PROVIDER === 'simulator' ? { developmentOtp: code } : {}),
  };
}

authRouter.post('/register', authLimit, async (request, response, next) => {
  const parsed = signupSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json(validationError('Enter your name, a valid Gmail address, mobile number, and password with at least 8 characters.'));
  }

  try {
    const { users } = await getCollections();
    const { name, email, mobile, password } = parsed.data;
    const existing = await users.findOne({ $or: [{ email }, { mobile }] }, { projection: { _id: 1 } });
    if (existing) {
      return response.status(409).json({ error: { code: 'ACCOUNT_EXISTS', message: 'An account already uses this Gmail address or mobile number.' } });
    }

    const now = new Date();
    const user: PassengerUser = {
      _id: new ObjectId(),
      name,
      email,
      mobile,
      passwordHash: await hashPassword(password),
      role: 'passenger',
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };
    await users.insertOne(user);
    const challenge = await startChallenge(user);
    return response.status(202).json(challenge);
  } catch (error) {
    if (error instanceof Error && error.message === 'OTP_DELIVERY_FAILED') {
      return response.status(503).json({ error: { code: 'OTP_DELIVERY_UNAVAILABLE', message: 'Could not send the verification code. Please try again.' } });
    }
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return response.status(409).json({ error: { code: 'ACCOUNT_EXISTS', message: 'An account already uses this Gmail address or mobile number.' } });
    }
    return next(error);
  }
});

authRouter.post('/login', authLimit, async (request, response, next) => {
  const parsed = credentialsSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json(validationError('Enter the Gmail address, mobile number, and password used to create your account.'));
  }

  try {
    const { users } = await getCollections();
    const user = await users.findOne({
      email: parsed.data.email,
      mobile: parsed.data.mobile,
      role: 'passenger',
    });
    const validPassword = user
      ? await verifyPassword(parsed.data.password, user.passwordHash)
      : await verifyPassword(parsed.data.password, '00000000000000000000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000');
    if (!user || !validPassword || user.status === 'suspended') {
      return response.status(401).json({ error: { code: 'INVALID_CREDENTIALS', message: 'The Gmail, mobile number, or password is incorrect.' } });
    }

    return response.status(202).json(await startChallenge(user));
  } catch (error) {
    if (error instanceof Error && error.message === 'OTP_DELIVERY_FAILED') {
      return response.status(503).json({ error: { code: 'OTP_DELIVERY_UNAVAILABLE', message: 'Could not send the verification code. Please try again.' } });
    }
    return next(error);
  }
});

authRouter.post('/verify-otp', authLimit, async (request, response, next) => {
  const parsed = verifySchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json(validationError('Enter the 6-digit code for this verification session.'));
  }

  try {
    const { users, otpChallenges } = await getCollections();
    const challenge = await otpChallenges.findOne({
      _id: parsed.data.sessionId,
      mobile: parsed.data.mobile,
      consumedAt: null,
      expiresAt: { $gt: new Date() },
      attempts: { $lt: OTP_MAX_ATTEMPTS },
    });
    if (!challenge) {
      return response.status(401).json({ error: { code: 'OTP_INVALID', message: 'The code is incorrect, expired, or already used.' } });
    }

    const approved = config.OTP_PROVIDER === 'simulator'
      ? otpMatches(parsed.data.otp, challenge.codeHash, config.JWT_SECRET)
      : await verifyProviderOtp(parsed.data.mobile, parsed.data.otp);
    if (!approved) {
      await otpChallenges.updateOne(
        { _id: challenge._id, consumedAt: null, attempts: challenge.attempts },
        { $inc: { attempts: 1 } },
      );
      return response.status(401).json({ error: { code: 'OTP_INVALID', message: 'The code is incorrect, expired, or already used.' } });
    }

    const consumed = await otpChallenges.updateOne(
      {
        _id: challenge._id,
        consumedAt: null,
        expiresAt: { $gt: new Date() },
        attempts: { $lt: OTP_MAX_ATTEMPTS },
      },
      { $set: { consumedAt: new Date() } },
    );
    if (consumed.modifiedCount !== 1) {
      return response.status(401).json({ error: { code: 'OTP_INVALID', message: 'The code is incorrect, expired, or already used.' } });
    }

    const user = await users.findOne({ _id: challenge.userId, status: { $ne: 'suspended' } });
    if (!user) {
      return response.status(401).json({ error: { code: 'ACCOUNT_UNAVAILABLE', message: 'This account is unavailable.' } });
    }
    await users.updateOne(
      { _id: user._id, status: 'pending' },
      { $set: { status: 'active', updatedAt: new Date() } },
    );
    const token = jwt.sign(
      { role: user.role },
      config.JWT_SECRET,
      { subject: user._id.toHexString(), expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
    );
    return response.json({ verified: true, token, role: user.role });
  } catch (error) {
    if (error instanceof OtpProviderError) {
      return response.status(503).json({ error: { code: 'OTP_DELIVERY_UNAVAILABLE', message: 'The verification provider is unavailable. Please try again later.' } });
    }
    return next(error);
  }
});

authRouter.post('/resend-otp', authLimit, async (request, response, next) => {
  const parsed = resendSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json(validationError('The verification session is invalid.'));
  }

  try {
    const { users, otpChallenges } = await getCollections();
    const previous = await otpChallenges.findOne({
      _id: parsed.data.sessionId,
      mobile: parsed.data.mobile,
      consumedAt: null,
      expiresAt: { $gt: new Date() },
      attempts: { $lt: OTP_MAX_ATTEMPTS },
    });
    if (!previous) {
      return response.status(404).json({ error: { code: 'SESSION_NOT_FOUND', message: 'The verification session was not found or has expired.' } });
    }
    const user = await users.findOne({ _id: previous.userId, status: { $ne: 'suspended' } });
    if (!user) {
      return response.status(404).json({ error: { code: 'ACCOUNT_UNAVAILABLE', message: 'This account is unavailable.' } });
    }

    return response.json(await startChallenge(user));
  } catch (error) {
    if (error instanceof Error && error.message === 'OTP_DELIVERY_FAILED') {
      return response.status(503).json({ error: { code: 'OTP_DELIVERY_UNAVAILABLE', message: 'Could not send the verification code. Please try again.' } });
    }
    return next(error);
  }
});
