import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { UserRole } from '../api/login';
import { resendOtp, verifyOtp } from '../api/otp';

export default function OtpScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { mobile, role, sessionId } = useLocalSearchParams<{
    mobile: string;
    role: UserRole;
    sessionId: string;
  }>();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter the 6-digit OTP.');
      return;
    }

    try {
      setLoading(true);
      const result = await verifyOtp({
        sessionId: sessionId ?? '',
        mobile: mobile ?? '',
        otp,
      });

      if (!result.verified || !role) {
        throw new Error('OTP verification failed.');
      }

      await AsyncStorage.multiSet([
        ['isLoggedIn', 'true'],
        ['userRole', role],
        ['userMobile', mobile ?? ''],
        ...(result.token
          ? ([['authToken', result.token]] as [string, string][])
          : []),
      ]);
      router.replace(
        role === 'driver'
          ? '/dashboards/Drivers/driver-dashboard'
          : '/dashboards/passenger/passenger-dashboard'
      );
    } catch (error) {
      Alert.alert(
        'Verification failed',
        error instanceof Error ? error.message : 'Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await resendOtp(sessionId ?? '', mobile ?? '');
      Alert.alert('OTP sent', 'A new OTP has been sent to your mobile number.');
    } catch (error) {
      Alert.alert(
        'Unable to resend',
        error instanceof Error ? error.message : 'Please try again.'
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View
        style={[
          styles.content,
          { paddingTop: Math.max(insets.top, 20) },
        ]}
      >
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <MaterialCommunityIcons name="arrow-left" size={24} color="#0f172a" />
        </Pressable>

        <View style={styles.logoCircle}>
          <MaterialCommunityIcons name="shield-check" size={34} color="#fff" />
        </View>
        <Text style={styles.title}>Verify your number</Text>
        <Text style={styles.subtitle}>
          Enter the 6-digit OTP sent to {mobile ? `******${mobile.slice(-4)}` : 'your mobile'}.
        </Text>

        <Text style={styles.label}>OTP</Text>
        <TextInput
          style={styles.otpInput}
          value={otp}
          onChangeText={(value) => setOtp(value.replace(/\D/g, '').slice(0, 6))}
          keyboardType="number-pad"
          maxLength={6}
          placeholder="000000"
          placeholderTextColor="#94a3b8"
          textContentType="oneTimeCode"
          autoFocus
        />

        <Pressable
          style={[styles.verifyButton, loading && styles.disabledButton]}
          onPress={handleVerify}
          disabled={loading}
        >
          <Text style={styles.verifyText}>
            {loading ? 'VERIFYING...' : 'VERIFY OTP'}
          </Text>
          {!loading && (
            <MaterialCommunityIcons name="arrow-right" size={22} color="#fff" />
          )}
        </Pressable>

        <Pressable onPress={handleResend}>
          <Text style={styles.resendText}>Resend OTP</Text>
        </Pressable>

        {!process.env.EXPO_PUBLIC_API_URL && (
          <Text style={styles.demoText}>Demo OTP: 123456</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { flex: 1, paddingHorizontal: 22 },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 70,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  logoCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 25,
  },
  title: { fontSize: 29, fontWeight: '900', color: '#0f172a', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#64748b', textAlign: 'center', marginTop: 9, marginBottom: 38 },
  label: { fontSize: 11, fontWeight: '800', color: '#475569', letterSpacing: 0.8, marginBottom: 8 },
  otpInput: {
    height: 64,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#16a34a',
    backgroundColor: '#fff',
    color: '#0f172a',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 10,
    textAlign: 'center',
    paddingLeft: 10,
  },
  verifyButton: {
    height: 58,
    borderRadius: 14,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 25,
  },
  disabledButton: { opacity: 0.65 },
  verifyText: { color: '#fff', fontSize: 15, fontWeight: '900' },
  resendText: { color: '#15803d', fontSize: 14, fontWeight: '800', textAlign: 'center', marginTop: 25 },
  demoText: { color: '#64748b', fontSize: 12, textAlign: 'center', marginTop: 35 },
});