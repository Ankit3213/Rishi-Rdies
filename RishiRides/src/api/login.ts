export type UserRole = 'passenger' | 'driver';

export type LoginResponse = {
  sessionId: string;
  mobile: string;
  role: UserRole;
  maskedMobile: string;
  demoOtp?: string;
};

type LoginRequest = {
  mobile: string;
  password: string;
  role: UserRole;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export async function loginUser(
  request: LoginRequest
): Promise<LoginResponse> {
  if (!API_BASE_URL) {
    return createLocalLoginResponse(request);
  }

  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('Unable to login with the supplied details.');
  }

  return response.json() as Promise<LoginResponse>;
}

function createLocalLoginResponse(
  request: LoginRequest
): LoginResponse {
  const sessionId = `local-${Date.now()}`;

  return {
    sessionId,
    mobile: request.mobile,
    role: request.role,
    maskedMobile: `******${request.mobile.slice(-4)}`,
    demoOtp: '123456',
  };
}