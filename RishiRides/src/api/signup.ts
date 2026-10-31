import type { LoginResponse } from './login';
import { API_BASE_URL, authenticationServiceError } from './config';

type SignupRequest = {
  name: string;
  mobile: string;
  email: string;
  password: string;
};

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
  }).catch(() => {
    throw authenticationServiceError();
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as {
      error?: { message?: string };
      message?: string;
    } | null;
    throw new Error(body?.error?.message || body?.message || 'Unable to create your passenger account.');
  }

  const result = await response.json() as Partial<LoginResponse>;
  if (!result.sessionId || !result.mobile || !result.deliveryMethod || result.role !== 'passenger') {
    throw new Error('The sign-up service returned an invalid verification session.');
  }

  return {
    sessionId: result.sessionId,
    mobile: result.mobile,
    ...(result.maskedEmail ? { maskedEmail: result.maskedEmail } : {}),
    deliveryMethod: result.deliveryMethod,
    role: 'passenger',
    maskedMobile: result.maskedMobile || `******${result.mobile.slice(-4)}`,
    ...(result.developmentOtp ? { developmentOtp: result.developmentOtp } : {}),
  };
}
