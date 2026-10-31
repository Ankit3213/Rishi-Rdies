import { Platform } from 'react-native';

const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL;

export const API_BASE_URL = (
  configuredApiUrl || (Platform.OS === 'web' ? 'http://localhost:4000' : '')
).replace(/\/$/, '');

export function authenticationServiceError(): Error {
  return new Error(
    `Could not connect to the authentication server at ${API_BASE_URL || 'EXPO_PUBLIC_API_URL'}. Start the auth server and MongoDB, then try again.`,
  );
}
