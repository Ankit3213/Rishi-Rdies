import { randomBytes, randomUUID } from 'node:crypto';
import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { z } from 'zod';
import { config } from '../config';
import { getCollections, type OtpChallenge, type PassengerUser } from '../db';
import { createOtpCode, hashOtp, hashPassword, otpMatches, verifyPassword } from './crypto';
import { GoogleIdentityError, verifyGoogleIdentity } from './google';
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
const googleSignInSchema = z.object({
  idToken: z.string().min(1).max(8192),
});
const googleRegistrationSchema = z.object({
  registrationToken: z.string().min(1).max(4096),
  mobile: mobileSchema,
});
const OTP_TTL_MS = 5 * 60 * 1000;
const OTP_MAX_ATTEMPTS = 5;

function validationError(message: string) {
  return { error: { code: 'VALIDATION_ERROR', message } };
}

function createPassengerSession(user: PassengerUser) {
  const token = jwt.sign(
    { role: user.role },
    config.JWT_SECRET,
    { subject: user._id.toHexString(), expiresIn: config.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] },
  );
  return { authenticated: true, token, mobile: user.mobile, role: user.role };
}

function googleRegistrationToken(email: string, name: string, googleSubject: string) {
  return jwt.sign(
    { purpose: 'google-registration', email, name, googleSubject },
    config.JWT_SECRET,
    { expiresIn: '10m' },
  );
}

authRouter.post('/google', authLimit, async (request, response, next) => {
  const parsed = googleSignInSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json(validationError('Choose a Google account to continue.'));
  }
  if (config.GOOGLE_OAUTH_CLIENT_IDS.length === 0) {
    return response.status(503).json({
      error: { code: 'GOOGLE_AUTH_NOT_CONFIGURED', message: 'Google sign-in is not configured on the authentication service.' },
    });
  }

  let identity: Awaited<ReturnType<typeof verifyGoogleIdentity>>;
  try {
    identity = await verifyGoogleIdentity(parsed.data.idToken);
  } catch (error) {
    if (error instanceof GoogleIdentityError) {
      return response.status(401).json({ error: { code: 'GOOGLE_AUTH_FAILED', message: error.message } });
    }
    return next(error);
  }

  try {
    const { users } = await getCollections();
    const user = await users.findOne({ email: identity.email, role: 'passenger' });
    if (!user) {
      return response.status(202).json({
        needsMobile: true,
        registrationToken: googleRegistrationToken(identity.email, identity.name, identity.googleSubject),
        email: identity.email,
        name: identity.name,
      });
    }
    if (user.status === 'suspended' || (user.googleSubject && user.googleSubject !== identity.googleSubject)) {
      return response.status(403).json({
        error: { code: 'GOOGLE_ACCOUNT_UNAVAILABLE', message: 'This Google account cannot access the passenger account.' },
      });
    }

    const linked = await users.updateOne(
      { _id: user._id, $or: [{ googleSubject: { $exists: false } }, { googleSubject: identity.googleSubject }] },
      { $set: { googleSubject: identity.googleSubject, status: 'active', updatedAt: new Date() } },
    );
    if (linked.matchedCount !== 1) {
      return response.status(403).json({
        error: { code: 'GOOGLE_ACCOUNT_UNAVAILABLE', message: 'This Google account cannot access the passenger account.' },
      });
    }
    return response.json(createPassengerSession({ ...user, googleSubject: identity.googleSubject, status: 'active' }));
  } catch (error) {
    return next(error);
  }
});

authRouter.post('/google/complete', authLimit, async (request, response, next) => {
  const parsed = googleRegistrationSchema.safeParse(request.body);
  if (!parsed.success) {
    return response.status(400).json(validationError('Enter a valid 10-digit mobile number to finish passenger signup.'));
  }

  let claims: unknown;
  try {
    claims = jwt.verify(parsed.data.registrationToken, config.JWT_SECRET);
  } catch {
    return response.status(401).json({
      error: { code: 'GOOGLE_REGISTRATION_EXPIRED', message: 'Google sign-in expired. Please continue with Gmail again.' },
    });
  }
  const registration = z.object({
    purpose: z.literal('google-registration'),
    email: emailSchema,
    name: z.string().min(1),
    googleSubject: z.string().min(1),
  }).safeParse(claims);
  if (!registration.success) {
    return response.status(401).json({
      error: { code: 'GOOGLE_REGISTRATION_INVALID', message: 'Google sign-in could not be verified. Please try again.' },
    });
  }

  try {
    const { users } = await getCollections();
    const existing = await users.findOne({ email: registration.data.email, role: 'passenger' });
    if (existing) {
      if (existing.status === 'suspended' || (existing.googleSubject && existing.googleSubject !== registration.data.googleSubject)) {
        return response.status(403).json({
          error: { code: 'GOOGLE_ACCOUNT_UNAVAILABLE', message: 'This Google account cannot access the passenger account.' },
        });
      }
      await users.updateOne(
        { _id: existing._id, $or: [{ googleSubject: { $exists: false } }, { googleSubject: registration.data.googleSubject }] },
        { $set: { googleSubject: registration.data.googleSubject, status: 'active', updatedAt: new Date() } },
      );
      return response.json(createPassengerSession({
        ...existing,
        googleSubject: registration.data.googleSubject,
        status: 'active',
      }));
    }

    const mobileInUse = await users.findOne({ mobile: parsed.data.mobile }, { projection: { _id: 1 } });
    if (mobileInUse) {
      return response.status(409).json({
        error: { code: 'MOBILE_IN_USE', message: 'That mobile number is already linked to an account. Use the Gmail address linked to that account.' },
      });
    }

    const user: PassengerUser = {
      _id: new ObjectId(),
      name: registration.data.name,
      email: registration.data.email,
      googleSubject: registration.data.googleSubject,
      mobile: parsed.data.mobile,
      passwordHash: await hashPassword(randomBytes(32).toString('hex')),
      role: 'passenger',
      status: 'active',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await users.insertOne(user);
    return response.status(201).json(createPassengerSession(user));
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 11000) {
      return response.status(409).json({
        error: { code: 'ACCOUNT_EXISTS', message: 'An account already uses this Gmail address or mobile number. Please try signing in again.' },
      });
    }
    return next(error);
  }
});

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
    await sendOtp(user.email, user.mobile, code);
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
    ...(config.OTP_PROVIDER !== 'twilio-verify'
      ? { maskedEmail: `${user.email[0]}***${user.email.slice(user.email.indexOf('@'))}` }
      : {}),
    deliveryMethod: config.OTP_PROVIDER === 'twilio-verify' ? 'sms' : 'email',
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
    try {
      return response.status(202).json(await startChallenge(user));
    } catch (error) {
      if (error instanceof Error && error.message === 'OTP_DELIVERY_FAILED') {
        await users.deleteOne({ _id: user._id, status: 'pending' });
      }
      throw error;
    }
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

    const approved = config.OTP_PROVIDER !== 'twilio-verify'
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
