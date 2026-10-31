import 'dotenv/config';
import { randomBytes } from 'node:crypto';
import { z } from 'zod';

const developmentJwtSecret = process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test'
  ? randomBytes(32).toString('hex')
  : '';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  MONGODB_URI: z.string().min(1).default('mongodb://127.0.0.1:27017'),
  MONGODB_DB: z.string().min(1).default('rishirides'),
  JWT_SECRET: z.string().min(32).default(developmentJwtSecret),
  JWT_EXPIRES_IN: z.string().default('1h'),
  CLIENT_ORIGINS: z.string().default('http://localhost:8081,http://localhost:5173')
    .transform((value) => value.split(',').map((origin) => origin.trim()).filter(Boolean))
    .pipe(z.array(z.url()).min(1)),
  OTP_PROVIDER: z.enum(['simulator', 'twilio-verify', 'email-smtp']).default('simulator'),
  TWILIO_ACCOUNT_SID: z.string().optional(),
  TWILIO_AUTH_TOKEN: z.string().optional(),
  TWILIO_VERIFY_SERVICE_SID: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().min(1).max(65535).default(587),
  SMTP_SECURE: z.enum(['true', 'false']).default('false').transform((value) => value === 'true'),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.email().optional(),
  GOOGLE_OAUTH_CLIENT_IDS: z.string().default('')
    .transform((value) => value.split(',').map((clientId) => clientId.trim()).filter(Boolean)),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid server configuration: ${z.treeifyError(parsed.error).errors.join('; ')}`);
}

if (parsed.data.NODE_ENV === 'production' && parsed.data.OTP_PROVIDER === 'simulator') {
  throw new Error('Production requires a configured OTP delivery provider.');
}
if (parsed.data.NODE_ENV !== 'development' && parsed.data.OTP_PROVIDER === 'simulator') {
  throw new Error('The OTP simulator is only allowed in development.');
}
if (parsed.data.OTP_PROVIDER === 'twilio-verify' && (
  !parsed.data.TWILIO_ACCOUNT_SID ||
  !parsed.data.TWILIO_AUTH_TOKEN ||
  !parsed.data.TWILIO_VERIFY_SERVICE_SID
)) {
  throw new Error('Twilio Verify requires its account SID, auth token, and service SID.');
}
if (parsed.data.OTP_PROVIDER === 'email-smtp' && (
  !parsed.data.SMTP_HOST ||
  !parsed.data.SMTP_USER ||
  !parsed.data.SMTP_PASSWORD
)) {
  throw new Error('Email OTP requires SMTP_HOST, SMTP_USER, and SMTP_PASSWORD.');
}
if (
  parsed.data.NODE_ENV === 'production' &&
  !parsed.data.MONGODB_URI.startsWith('mongodb+srv://') &&
  !/[?&]tls=true(?:&|$)/i.test(parsed.data.MONGODB_URI)
) {
  throw new Error('Production MongoDB connections must use TLS.');
}

export const config = parsed.data;
