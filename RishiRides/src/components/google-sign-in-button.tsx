import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import React, { useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {
  completeGoogleSignup,
  signInWithGoogle,
  type GoogleSignInResult,
} from '../api/google-auth';

WebBrowser.maybeCompleteAuthSession();

const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID || '';
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID || '';
const androidClientId = process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID || '';
const clientIdsConfigured = Boolean(Platform.select({
  web: webClientId,
  ios: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
  android: process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID,
  default: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
}));
const redirectUri = AuthSession.makeRedirectUri();

type AuthenticatedAccount = {
  token: string;
  mobile: string;
};

type GoogleSignInButtonProps = {
  onAuthenticated: (account: AuthenticatedAccount) => Promise<void>;
  disabled?: boolean;
};

export default function GoogleSignInButton({
  onAuthenticated,
  disabled = false,
}: GoogleSignInButtonProps) {
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    webClientId,
    iosClientId,
    androidClientId,
    redirectUri,
    scopes: ['openid', 'profile', 'email'],
    selectAccount: true,
  });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [mobile, setMobile] = useState('');
  const [registration, setRegistration] = useState<Extract<GoogleSignInResult, { needsMobile: true }> | null>(null);
  const processedResponse = useRef<string | null>(null);
  const onAuthenticatedRef = useRef(onAuthenticated);
  onAuthenticatedRef.current = onAuthenticated;

  useEffect(() => {
    if (!response || response.type === 'dismiss' || response.type === 'cancel') return;
    if (response.type === 'error') {
      setNotice(
        `Google sign-in failed. Check your Web OAuth client. Redirect URI: ${redirectUri}`,
      );
      console.error('Google OAuth error:', response.error);
      console.error('Google redirect URI:', redirectUri);
      return;
    }
    if (response.type !== 'success') return;

    const idToken = response.params.id_token;
    if (!idToken) {
      setNotice('Google did not return an ID token. Check your Google OAuth client configuration.');
      return;
    }
    if (processedResponse.current === idToken) return;
    processedResponse.current = idToken;

    let active = true;
    setBusy(true);
    setNotice('');
    void signInWithGoogle(idToken)
      .then(async (result) => {
        if (!active) return;
        if (result.needsMobile) {
          setRegistration(result);
          setMobile('');
          return;
        }
        await onAuthenticatedRef.current({ token: result.token, mobile: result.mobile });
      })
      .catch((error: unknown) => {
        if (active) setNotice(error instanceof Error ? error.message : 'Gmail sign-in failed. Please try again.');
      })
      .finally(() => {
        if (active) setBusy(false);
      });

    return () => {
      active = false;
    };
  }, [response]);

  const beginGoogleSignIn = async () => {
    setNotice('');
    if (!clientIdsConfigured) {
      const platform = Platform.OS === 'web' ? 'web' : Platform.OS;
      setNotice(`Add EXPO_PUBLIC_GOOGLE_${platform.toUpperCase()}_CLIENT_ID to the app .env, then restart Expo.`);
      return;
    }
    if (!request) {
      setNotice('Google sign-in is still loading. Please try again in a moment.');
      return;
    }

    setBusy(true);
    try {
      await promptAsync();
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not open Google sign-in.');
    } finally {
      setBusy(false);
    }
  };

  const finishSignup = async () => {
    const cleanMobile = mobile.replace(/\D/g, '');
    setNotice('');
    if (!registration) return;
    if (cleanMobile.length !== 10) {
      setNotice('Enter a valid 10-digit mobile number to finish passenger signup.');
      return;
    }

    setBusy(true);
    try {
      const account = await completeGoogleSignup(registration.registrationToken, cleanMobile);
      await onAuthenticatedRef.current({ token: account.token, mobile: account.mobile });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Could not create your passenger account.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <View>
      {registration ? (
        <View style={styles.registrationPanel}>
          <Text style={styles.registrationTitle}>Finish passenger signup</Text>
          <Text style={styles.registrationHint}>
            No account was found for {registration.email}. Add a mobile number to create one.
          </Text>
          <View style={styles.inputContainer}>
            <MaterialCommunityIcons name="cellphone" size={18} color="#68818A" />
            <TextInput
              accessibilityLabel="Mobile number for Google signup"
              style={styles.input}
              placeholder="10-digit mobile number"
              placeholderTextColor="#9AAAB0"
              value={mobile}
              onChangeText={(value) => setMobile(value.replace(/\D/g, '').slice(0, 10))}
              keyboardType="phone-pad"
              maxLength={10}
              autoComplete="tel"
            />
          </View>
          <Pressable
            accessibilityRole="button"
            style={[styles.googleButton, busy && styles.disabled]}
            onPress={finishSignup}
            disabled={busy}
          >
            <Text style={styles.googleText}>{busy ? 'CREATING ACCOUNT…' : 'Create passenger account'}</Text>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            style={styles.cancelButton}
            onPress={() => {
              setRegistration(null);
              setMobile('');
              setNotice('');
            }}
          >
            <Text style={styles.cancelText}>Use another Gmail account</Text>
          </Pressable>
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          style={[styles.googleButton, (busy || disabled) && styles.disabled]}
          onPress={beginGoogleSignIn}
          disabled={busy || disabled}
        >
          <MaterialCommunityIcons name="google" size={18} color="#4285F4" />
          <Text style={styles.googleText}>{busy ? 'CONNECTING TO GMAIL…' : 'Continue with Gmail'}</Text>
        </Pressable>
      )}
      {!!notice && <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  googleButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DCE6E8',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 10,
  },
  disabled: {
    opacity: 0.6,
  },
  googleText: {
    color: '#334C53',
    fontSize: 11,
    fontWeight: '800',
  },
  notice: {
    color: '#A43D32',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 8,
  },
  registrationPanel: {
    gap: 9,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCE6E8',
    padding: 12,
    backgroundColor: '#FFFFFF',
  },
  registrationTitle: {
    color: '#20383F',
    fontSize: 12,
    fontWeight: '900',
  },
  registrationHint: {
    color: '#71838A',
    fontSize: 10,
    lineHeight: 15,
  },
  inputContainer: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCE6E8',
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 41,
    color: '#20383F',
    fontSize: 12,
  },
  cancelButton: {
    alignSelf: 'center',
    padding: 5,
  },
  cancelText: {
    color: '#087C50',
    fontSize: 10,
    fontWeight: '700',
  },
});
