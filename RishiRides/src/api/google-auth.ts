import { API_BASE_URL, authenticationServiceError } from './config';

type AuthenticatedGoogleAccount = {
  needsMobile?: false;
  authenticated: true;
  token: string;
  mobile: string;
  role: 'passenger';
};

type GoogleRegistration = {
  needsMobile: true;
  registrationToken: string;
  email: string;
  name: string;
};

export type GoogleSignInResult = AuthenticatedGoogleAccount | GoogleRegistration;

async function post<T>(path: string, body: unknown): Promise<T> {
  if (!API_BASE_URL) {
    throw new Error('Gmail sign-in is unavailable because the authentication service is not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {
    throw authenticationServiceError();
  });
  if (!response.ok) {
    const result = await response.json().catch(() => null) as {
      error?: { message?: string };
      message?: string;
    } | null;
    throw new Error(result?.error?.message || result?.message || 'Gmail sign-in could not be completed.');
  }
  return response.json() as Promise<T>;
}

export function signInWithGoogle(idToken: string): Promise<GoogleSignInResult> {
  return post<GoogleSignInResult>('google', { idToken });
}

export function completeGoogleSignup(
  registrationToken: string,
  mobile: string,
): Promise<AuthenticatedGoogleAccount> {
  return post<AuthenticatedGoogleAccount>('google/complete', { registrationToken, mobile });
}
