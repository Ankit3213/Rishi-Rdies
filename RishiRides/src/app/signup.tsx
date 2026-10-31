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
  type TextInputProps,
} from 'react-native';
import AuthLayout from '../components/auth-layout';
import GoogleSignInButton from '../components/google-sign-in-button';
import { signupUser } from '../api/signup';

export default function SignupScreen() {
  const router = useRouter();
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  const handleSignup = async () => {
    setNotice('');
    const cleanName = name.trim();
    const cleanMobile = mobile.replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();

    if (!cleanName) {
      setNotice('Enter your full name.');
      return;
    }
    if (cleanMobile.length !== 10) {
      setNotice('Enter a valid 10-digit mobile number.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setNotice('Enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setNotice('Choose a password with at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setNotice('The passwords do not match.');
      return;
    }

    try {
      setLoading(true);
      const response = await signupUser({
        name: cleanName,
        mobile: cleanMobile,
        email: cleanEmail,
        password,
      });

      router.push({
        pathname: '/otp',
        params: {
          mobile: response.mobile,
          ...(response.maskedEmail ? { maskedEmail: response.maskedEmail } : {}),
          deliveryMethod: response.deliveryMethod,
          role: response.role,
          sessionId: response.sessionId,
          ...(response.developmentOtp ? { developmentOtp: response.developmentOtp } : {}),
          flow: flow === 'booking' ? 'booking-signup' : 'signup',
        },
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to create your account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuthenticated = async ({ token, mobile: accountMobile }: { token: string; mobile: string }) => {
    await AsyncStorage.multiSet([
      ['isLoggedIn', 'true'],
      ['userRole', 'passenger'],
      ['userMobile', accountMobile],
      ['authToken', token],
    ]);
    router.replace('/dashboards/passenger/passenger');
  };

  return (
    <AuthLayout mode="signup">
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
          <MaterialCommunityIcons name="account-plus" size={22} color="#FFFFFF" />
        </View>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>Passenger Signup</Text>
          <Text style={styles.subtitle}>Create your account to continue</Text>
        </View>
      </View>

      <Field
        accessibilityLabel="Full name"
        icon="account-outline"
        label="FULL NAME"
        placeholder="Enter your full name"
        value={name}
        onChangeText={(value) => {
          setName(value);
          setNotice('');
        }}
        autoCapitalize="words"
        autoComplete="name"
      />
      <Field
        accessibilityLabel="Mobile number"
        icon="cellphone"
        label="MOBILE NUMBER"
        placeholder="Enter your mobile number"
        value={mobile}
        onChangeText={(value) => {
          setMobile(value.replace(/\D/g, '').slice(0, 10));
          setNotice('');
        }}
        keyboardType="phone-pad"
        maxLength={10}
        autoComplete="tel"
      />
      <Field
        accessibilityLabel="Email address"
        icon="email-outline"
        label="GMAIL ADDRESS"
        placeholder="Enter your Gmail address"
        value={email}
        onChangeText={(value) => {
          setEmail(value);
          setNotice('');
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        autoComplete="email"
      />

      <Field
        accessibilityLabel="Password"
        icon="lock-outline"
        label="PASSWORD"
        placeholder="Create a password (8+ characters)"
        value={password}
        onChangeText={(value) => {
          setPassword(value);
          setNotice('');
        }}
        secureTextEntry={!showPassword}
        autoComplete="new-password"
        rightIcon={showPassword ? 'eye-off-outline' : 'eye-outline'}
        onRightPress={() => setShowPassword((visible) => !visible)}
      />
      <Field
        accessibilityLabel="Confirm password"
        icon="lock-check-outline"
        label="CONFIRM PASSWORD"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChangeText={(value) => {
          setConfirmPassword(value);
          setNotice('');
        }}
        secureTextEntry={!showConfirmPassword}
        autoComplete="new-password"
        rightIcon={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
        onRightPress={() => setShowConfirmPassword((visible) => !visible)}
      />

      {!!notice && <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text>}

      <Pressable
        accessibilityRole="button"
        style={[styles.submitButton, loading && styles.submitDisabled]}
        onPress={handleSignup}
        disabled={loading}
      >
        <Text style={styles.submitText}>{loading ? 'CREATING ACCOUNT…' : 'Create Account'}</Text>
        {!loading && <MaterialCommunityIcons name="arrow-right" size={19} color="#FFFFFF" />}
      </Pressable>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Already have an account?</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({
            pathname: '/login',
            params: flow === 'booking' ? { role: 'passenger', flow: 'booking' } : { role: 'passenger' },
          })}
        >
          <Text style={styles.switchLink}>Login</Text>
        </Pressable>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>
      <GoogleSignInButton onAuthenticated={handleGoogleAuthenticated} disabled={loading} />
    </AuthLayout>
  );
}

function Field({
  icon,
  label,
  rightIcon,
  onRightPress,
  ...inputProps
}: TextInputProps & {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  rightIcon?: keyof typeof MaterialCommunityIcons.glyphMap;
  onRightPress?: () => void;
}) {
  return (
    <>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name={icon} size={18} color="#68818A" />
        <TextInput
          {...inputProps}
          style={styles.input}
          placeholderTextColor="#9AAAB0"
        />
        {rightIcon && onRightPress && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={rightIcon === 'eye-outline' ? 'Show password' : 'Hide password'}
            onPress={onRightPress}
            hitSlop={10}
          >
            <MaterialCommunityIcons name={rightIcon} size={19} color="#68818A" />
          </Pressable>
        )}
      </View>
    </>
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
    marginBottom: 8,
  },
  heading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 11,
    marginBottom: 12,
  },
  headingIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#078653',
  },
  headingCopy: {
    flex: 1,
  },
  title: {
    color: '#18313A',
    fontSize: 19,
    fontWeight: '900',
  },
  subtitle: {
    color: '#71838A',
    fontSize: 10,
    marginTop: 3,
  },
  label: {
    color: '#415961',
    fontSize: 9,
    fontWeight: '800',
    marginBottom: 5,
    marginTop: 7,
  },
  inputContainer: {
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DCE6E8',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 38,
    paddingVertical: 6,
    color: '#20383F',
    fontSize: 11,
  },
  notice: {
    color: '#A43D32',
    fontSize: 10,
    lineHeight: 15,
    marginTop: 9,
  },
  submitButton: {
    minHeight: 43,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 8,
    backgroundColor: '#078653',
    marginTop: 12,
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    marginTop: 12,
  },
  switchText: {
    color: '#71838A',
    fontSize: 9,
  },
  switchLink: {
    color: '#087C50',
    fontSize: 9,
    fontWeight: '900',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 12,
    marginBottom: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4EBE8',
  },
  dividerText: {
    color: '#97A5A4',
    fontSize: 8,
    fontWeight: '700',
  },
});
