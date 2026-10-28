import assert from 'node:assert/strict';
import test from 'node:test';
import { createOtpCode, hashOtp, hashPassword, otpMatches, verifyPassword } from '../src/auth/crypto';

test('password hashes are salted and verify without storing plaintext', async () => {
  const firstHash = await hashPassword('correct horse battery staple');
  const secondHash = await hashPassword('correct horse battery staple');

  assert.notEqual(firstHash, secondHash);
  assert.equal(await verifyPassword('correct horse battery staple', firstHash), true);
  assert.equal(await verifyPassword('incorrect password', firstHash), false);
});

test('OTP codes are six digits and are compared using a keyed digest', () => {
  const code = createOtpCode();
  const digest = hashOtp(code, 'a-private-secret');

  assert.match(code, /^[0-9]{6}$/);
  assert.equal(otpMatches(code, digest, 'a-private-secret'), true);
  assert.equal(otpMatches('000000', digest, 'a-private-secret'), false);
  assert.equal(otpMatches(code, digest, 'another-secret'), false);
});
