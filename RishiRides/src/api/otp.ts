export type OtpResponse = {
  verified: boolean;
  token?: string;
};

type OtpRequest = {
  sessionId: string;
  mobile: string;
  otp: string;
};

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL?.replace(/\/$/, '');

export async function verifyOtp(
  request: OtpRequest
): Promise<OtpResponse> {
  if (!API_BASE_URL) {
    if (request.otp !== '123456') {
      throw new Error('The OTP is incorrect.');
    }

    return { verified: true, token: request.sessionId };
  }

  const response = await fetch(`${API_BASE_URL}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error('The OTP is incorrect or has expired.');
  }

  return response.json() as Promise<OtpResponse>;
}

export async function resendOtp(
  sessionId: string,
  mobile: string
): Promise<void> {
  if (!API_BASE_URL) {
    return;
  }

  const response = await fetch(`${API_BASE_URL}/auth/resend-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId, mobile }),
  });

  if (!response.ok) {
    throw new Error('Unable to resend the OTP.');
  }
}