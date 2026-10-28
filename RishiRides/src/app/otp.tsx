import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AuthLayout from '../components/auth-layout';
import type { UserRole } from '../api/login';
import { resendOtp, verifyOtp } from '../api/otp';

export default function OtpScreen() {
  const router = useRouter();
  const { mobile, role, sessionId, flow } = useLocalSearchParams<{
    mobile?: string;
    role?: UserRole;
    sessionId?: string;
    flow?: string;
  }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [notice, setNotice] = useState('');

  const handleVerify = async () => {
    setNotice('');
    if (!sessionId || !mobile || !role) {
      setNotice('This verification link is incomplete. Go back and start again.');
      return;
    }
    if (otp.length !== 6) {
      setNotice('Enter the complete 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      const result = await verifyOtp({ sessionId, mobile, otp });
      if (!result.verified) {
        throw new Error('That code could not be verified. Check it and try again.');
      }

      const values: [string, string][] = [
        ['isLoggedIn', 'true'],
        ['userRole', role],
        ['userMobile', mobile],
      ];
      if (result.token) values.push(['authToken', result.token]);
      await AsyncStorage.multiSet(values);
      router.replace(
        role === 'driver'
          ? '/dashboards/Drivers/driver-dashboard'
          : '/dashboards/passenger/passenger-dashboard'
      );
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Verification failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!sessionId || !mobile) {
      setNotice('This verification session is incomplete. Go back and start again.');
      return;
    }
    setNotice('');
    try {
      setResending(true);
      await resendOtp(sessionId, mobile);
      setNotice('A new verification code has been sent.');
      setOtp('');
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to resend the code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthLayout mode="otp">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Go back"
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <MaterialCommunityIcons name="arrow-left" size={19} color="#45636B" />
      </Pressable>

      <View style={styles.heading}>
        <View style={styles.headingIcon}>
          <MaterialCommunityIcons name="shield-check" size={23} color="#FFFFFF" />
        </View>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>Verify your number</Text>
          <Text style={styles.subtitle}>One last step to secure your account</Text>
        </View>
      </View>

      <Text style={styles.description}>
        Enter the 6-digit code sent to{' '}
        <Text style={styles.mobile}>{mobile ? `******${mobile.slice(-4)}` : 'your mobile number'}</Text>.
      </Text>

      <Text style={styles.label}>VERIFICATION CODE</Text>
      <TextInput
        accessibilityLabel="6-digit verification code"
        style={styles.otpInput}
        value={otp}
        onChangeText={(value) => {
          setOtp(value.replace(/\D/g, '').slice(0, 6));
          setNotice('');
        }}
        keyboardType="number-pad"
        maxLength={6}
        placeholder="• • • • • •"
        placeholderTextColor="#A6B6B7"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        autoFocus
        returnKeyType="done"
        onSubmitEditing={handleVerify}
      />

      {!!notice && (
        <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text>
      )}

      <Pressable
        accessibilityRole="button"
        style={[styles.submitButton, (loading || otp.length !== 6) && styles.submitDisabled]}
        onPress={handleVerify}
        disabled={loading || otp.length !== 6}
      >
        <Text style={styles.submitText}>{loading ? 'VERIFYING…' : 'Verify'}</Text>
        {!loading && <MaterialCommunityIcons name="arrow-right" size={19} color="#FFFFFF" />}
      </Pressable>

      <View style={styles.resendRow}>
        <Text style={styles.resendHint}>Didn&apos;t receive a code?</Text>
        <Pressable
          accessibilityRole="button"
          onPress={handleResend}
          disabled={resending}
        >
          <Text style={[styles.resendText, resending && styles.resendDisabled]}>
            {resending ? 'Sending…' : 'Resend code'}
          </Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityRole="button"
        style={styles.changeNumber}
        onPress={() => router.back()}
      >
        <Text style={styles.changeNumberText}>Change mobile number</Text>
      </Pressable>

      {flow?.includes('signup') && (
        <View style={styles.securityRow}>
          <MaterialCommunityIcons name="account-check-outline" size={16} color="#078653" />
          <Text style={styles.securityText}>Your passenger account will be verified securely</Text>
        </View>
      )}
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  backButton: {
    width: 34,
    height: 34,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F8F5',
    marginBottom: 10,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 18,
  },
  headingIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#078653',
  },
  headingCopy: {
    flex: 1,
  },
  title: {
    color: '#18313A',
    fontSize: 20,
    fontWeight: '900',
  },
  subtitle: {
    color: '#71838A',
    fontSize: 11,
    marginTop: 3,
  },
  description: {
    color: '#62777D',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 20,
  },
  mobile: {
    color: '#263F46',
    fontWeight: '800',
  },
  label: {
    color: '#415961',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 8,
  },
  otpInput: {
    height: 59,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#DCE6E8',
    backgroundColor: '#FFFFFF',
    color: '#18313A',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: 12,
    textAlign: 'center',
    paddingLeft: 12,
  },
  notice: {
    color: '#A43D32',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 10,
  },
  submitButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 9,
    backgroundColor: '#078653',
    marginTop: 17,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  resendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 18,
  },
  resendHint: {
    color: '#71838A',
    fontSize: 10,
  },
  resendText: {
    color: '#087C50',
    fontSize: 10,
    fontWeight: '900',
  },
  resendDisabled: {
    opacity: 0.55,
  },
  changeNumber: {
    alignSelf: 'center',
    padding: 9,
    marginTop: 3,
  },
  changeNumberText: {
    color: '#62777D',
    fontSize: 10,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 13,
  },
  securityText: {
    color: '#71838A',
    fontSize: 9,
  },
});
