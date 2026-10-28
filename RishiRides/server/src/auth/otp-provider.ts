import { config } from '../config';

export class OtpProviderError extends Error {}

function twilioCredentials() {
  return {
    accountSid: config.TWILIO_ACCOUNT_SID!,
    authToken: config.TWILIO_AUTH_TOKEN!,
    serviceSid: config.TWILIO_VERIFY_SERVICE_SID!,
  };
}

async function requestTwilio(
  path: string,
  body: URLSearchParams,
  fetcher: typeof fetch,
): Promise<{ status?: string }> {
  const { accountSid, authToken, serviceSid } = twilioCredentials();
  const response = await fetcher(`https://verify.twilio.com/v2/Services/${serviceSid}/${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body,
  });
  if (!response.ok) {
    if (path === 'VerificationCheck' && [400, 404].includes(response.status)) return {};
    throw new OtpProviderError('The verification provider could not complete the request.');
  }
  return response.json() as Promise<{ status?: string }>;
}

export async function sendOtp(mobile: string, fetcher: typeof fetch = fetch): Promise<void> {
  if (config.OTP_PROVIDER === 'simulator') return;
  await requestTwilio('Verifications', new URLSearchParams({ To: `+91${mobile}`, Channel: 'sms' }), fetcher);
}

export async function verifyProviderOtp(
  mobile: string,
  code: string,
  fetcher: typeof fetch = fetch,
): Promise<boolean> {
  if (config.OTP_PROVIDER === 'simulator') return false;
  const result = await requestTwilio(
    'VerificationCheck',
    new URLSearchParams({ To: `+91${mobile}`, Code: code }),
    fetcher,
  );
  return result.status === 'approved';
}
