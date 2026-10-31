import { OAuth2Client } from 'google-auth-library';
import { config } from '../config';

const googleClient = new OAuth2Client();

export class GoogleIdentityError extends Error {}

export async function verifyGoogleIdentity(idToken: string) {
  if (config.GOOGLE_OAUTH_CLIENT_IDS.length === 0) {
    throw new Error('Google sign-in is not configured on the server.');
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({
      idToken,
      audience: config.GOOGLE_OAUTH_CLIENT_IDS,
    });
    payload = ticket.getPayload();
  } catch (error) {
    const status = typeof error === 'object' && error !== null && 'response' in error
      && typeof error.response === 'object' && error.response !== null && 'status' in error.response
      ? error.response.status
      : undefined;
    if (typeof status === 'number' && status >= 500) throw error;
    throw new GoogleIdentityError('Google could not verify this sign-in. Please try again.');
  }

  if (
    !payload?.sub ||
    !payload.email ||
    payload.email_verified !== true ||
    !payload.email.toLowerCase().endsWith('@gmail.com')
  ) {
    throw new GoogleIdentityError('Use a verified @gmail.com Google account.');
  }

  return {
    googleSubject: payload.sub,
    email: payload.email.trim().toLowerCase(),
    name: payload.name?.trim() || payload.email.split('@')[0],
  };
}
