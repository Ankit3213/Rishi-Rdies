import nodemailer from 'nodemailer';
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

export async function sendOtp(
  email: string,
  mobile: string,
  code: string,
  fetcher: typeof fetch = fetch,
): Promise<void> {
  if (config.OTP_PROVIDER === 'simulator') return;
  if (config.OTP_PROVIDER === 'email-smtp') {
    const transporter = nodemailer.createTransport({
      host: config.SMTP_HOST,
      port: config.SMTP_PORT,
      secure: config.SMTP_SECURE,
      auth: {
        user: config.SMTP_USER,
        pass: config.SMTP_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: config.SMTP_FROM ?? config.SMTP_USER,
      to: email,
      subject: 'Your RishiRide verification code',
      text: `Your RishiRide verification code is ${code}. It expires in 5 minutes. If you did not request this code, you can ignore this email.`,
    });
    return;
  }
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
