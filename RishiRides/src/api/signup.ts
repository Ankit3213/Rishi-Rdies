import type { LoginResponse } from './login';

type SignupRequest = {
  name: string;
  mobile: string;
  email: string;
  password: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export async function signupUser(
  request: SignupRequest
): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    throw new Error('Sign-up is unavailable because the authentication service is not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...request, role: 'passenger' }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message || 'Unable to create your passenger account.');
  }

  const result = await response.json() as Partial<LoginResponse>;
  if (!result.sessionId || !result.mobile || result.role !== 'passenger') {
    throw new Error('The sign-up service returned an invalid verification session.');
  }

  return {
    sessionId: result.sessionId,
    mobile: result.mobile,
    role: 'passenger',
    maskedMobile: result.maskedMobile || `******${result.mobile.slice(-4)}`,
  };
}
