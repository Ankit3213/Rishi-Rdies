import { createHmac, randomBytes, randomInt, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

const scrypt = promisify(scryptCallback);
const PASSWORD_KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH) as Buffer;
  return `${salt}:${derivedKey.toString('hex')}`;
}

export async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [salt, encodedKey] = storedHash.split(':');
  if (!salt || !encodedKey || !/^[a-f0-9]+$/i.test(salt) || !/^[a-f0-9]+$/i.test(encodedKey)) return false;
  const expectedKey = Buffer.from(encodedKey, 'hex');
  if (expectedKey.length !== PASSWORD_KEY_LENGTH) return false;
  const derivedKey = await scrypt(password, salt, PASSWORD_KEY_LENGTH) as Buffer;
  return timingSafeEqual(derivedKey, expectedKey);
}

export function createOtpCode(): string {
  return randomInt(0, 1_000_000).toString().padStart(6, '0');
}

export function hashOtp(code: string, secret: string): string {
  return createHmac('sha256', secret).update(code).digest('hex');
}

export function otpMatches(code: string, expectedHash: string, secret: string): boolean {
  const expected = Buffer.from(expectedHash, 'hex');
  const actual = Buffer.from(hashOtp(code, secret), 'hex');
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}
