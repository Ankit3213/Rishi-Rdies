export type UserRole = 'passenger' | 'driver';

export type LoginResponse = {
  sessionId: string;
  mobile: string;
  role: UserRole;
  maskedMobile: string;
  developmentOtp?: string;
};

type LoginRequest = {
  email: string;
  mobile: string;
  password: string;
  role: UserRole;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export async function loginUser(
  request: LoginRequest
): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    throw new Error('Sign-in is unavailable because the authentication service is not configured.');
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null) as {
      error?: { message?: string };
      message?: string;
    } | null;
    throw new Error(body?.error?.message || body?.message || 'Unable to login with the supplied details.');
  }

  return response.json() as Promise<LoginResponse>;
}