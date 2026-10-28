import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AuthLayout from '../components/auth-layout';
import { loginUser } from '../api/login';

const rememberedMobileKey = 'rememberedMobile';

export default function LoginScreen() {
  const router = useRouter();
  const { flow } = useLocalSearchParams<{ flow?: string }>();
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(rememberedMobileKey)
      .then((savedMobile) => {
        if (active && savedMobile) setMobile(savedMobile);
      })
      .catch(() => {
        if (active) setNotice('Could not load your saved mobile number.');
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLogin = async () => {
    const cleanMobile = mobile.replace(/\D/g, '');
    setNotice('');

    if (cleanMobile.length !== 10) {
      setNotice('Enter a valid 10-digit mobile number.');
      return;
    }

    if (!password.trim()) {
      setNotice('Enter your password to continue.');
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser({
        mobile: cleanMobile,
        password,
        role: 'passenger',
      });

      try {
        if (rememberMe) {
          await AsyncStorage.setItem(rememberedMobileKey, cleanMobile);
        } else {
          await AsyncStorage.removeItem(rememberedMobileKey);
        }
      } catch {
        setNotice('Verification is ready, but your remember-me preference could not be saved.');
      }

      router.push({
        pathname: '/otp',
        params: {
          mobile: response.mobile,
          role: response.role,
          sessionId: response.sessionId,
          flow: flow === 'booking' ? 'booking' : 'login',
        },
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Unable to sign in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout mode="login">
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
          <MaterialCommunityIcons name="account" size={22} color="#FFFFFF" />
        </View>
        <View style={styles.headingCopy}>
          <Text style={styles.title}>Passenger Login</Text>
          <Text style={styles.subtitle}>Enter your details to continue</Text>
        </View>
      </View>

      <Text style={styles.label}>MOBILE NUMBER</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="cellphone" size={19} color="#68818A" />
        <TextInput
          accessibilityLabel="Mobile number"
          style={styles.input}
          placeholder="Enter your mobile number"
          placeholderTextColor="#9AAAB0"
          value={mobile}
          onChangeText={(text) => {
            setMobile(text.replace(/\D/g, '').slice(0, 10));
            setNotice('');
          }}
          keyboardType="phone-pad"
          maxLength={10}
          autoComplete="tel"
        />
      </View>

      <Text style={styles.label}>PASSWORD</Text>
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={19} color="#68818A" />
        <TextInput
          accessibilityLabel="Password"
          style={styles.input}
          placeholder="Enter your password"
          placeholderTextColor="#9AAAB0"
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            setNotice('');
          }}
          secureTextEntry={!showPassword}
          autoComplete="current-password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
        />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
          onPress={() => setShowPassword((visible) => !visible)}
          hitSlop={10}
        >
          <MaterialCommunityIcons
            name={showPassword ? 'eye-off-outline' : 'eye-outline'}
            size={19}
            color="#68818A"
          />
        </Pressable>
      </View>

      <View style={styles.optionsRow}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: rememberMe }}
          style={styles.rememberButton}
          onPress={() => setRememberMe((checked) => !checked)}
        >
          <MaterialCommunityIcons
            name={rememberMe ? 'checkbox-marked-outline' : 'checkbox-blank-outline'}
            size={18}
            color={rememberMe ? '#078653' : '#82949A'}
          />
          <Text style={styles.rememberText}>Remember me</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          onPress={() => setNotice('Password recovery is not available yet. Please contact RishiRide support.')}
        >
          <Text style={styles.forgotText}>Forgot password?</Text>
        </Pressable>
      </View>

      {!!notice && <Text accessibilityRole="alert" style={styles.notice}>{notice}</Text>}

      <Pressable
        accessibilityRole="button"
        style={[styles.submitButton, loading && styles.submitDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.submitText}>{loading ? 'SIGNING IN…' : 'Login'}</Text>
        {!loading && <MaterialCommunityIcons name="arrow-right" size={19} color="#FFFFFF" />}
      </Pressable>

      <View style={styles.switchRow}>
        <Text style={styles.switchText}>Don&apos;t have an account?</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => router.push({
            pathname: '/signup',
            params: flow === 'booking' ? { role: 'passenger', flow: 'booking' } : { role: 'passenger' },
          })}
        >
          <Text style={styles.switchLink}>Sign up</Text>
        </Pressable>
      </View>

      <View style={styles.dividerRow}>
        <View style={styles.divider} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.divider} />
      </View>
      <View style={styles.googleButton}>
        <MaterialCommunityIcons name="google" size={17} color="#4285F4" />
        <Text style={styles.googleText}>Google sign-in is not connected</Text>
      </View>
      <View style={styles.securityRow}>
        <MaterialCommunityIcons name="shield-check-outline" size={16} color="#078653" />
        <Text style={styles.securityText}>Your information stays secure</Text>
      </View>
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
    marginBottom: 23,
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
  label: {
    color: '#415961',
    fontSize: 10,
    fontWeight: '800',
    marginBottom: 7,
    marginTop: 11,
  },
  inputContainer: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    paddingHorizontal: 12,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DCE6E8',
    backgroundColor: '#FFFFFF',
  },
  input: {
    flex: 1,
    minWidth: 0,
    minHeight: 44,
    paddingVertical: 8,
    color: '#20383F',
    fontSize: 12,
  },
  optionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 10,
    marginTop: 13,
    marginBottom: 14,
  },
  rememberButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  rememberText: {
    color: '#61777D',
    fontSize: 10,
  },
  forgotText: {
    color: '#087C50',
    fontSize: 10,
    fontWeight: '700',
  },
  notice: {
    color: '#A43D32',
    fontSize: 11,
    lineHeight: 16,
    marginBottom: 12,
  },
  submitButton: {
    minHeight: 47,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 9,
    backgroundColor: '#078653',
  },
  submitDisabled: {
    opacity: 0.6,
  },
  submitText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    marginTop: 15,
  },
  switchText: {
    color: '#71838A',
    fontSize: 10,
  },
  switchLink: {
    color: '#087C50',
    fontSize: 10,
    fontWeight: '900',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 17,
    marginBottom: 12,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E4EBE8',
  },
  dividerText: {
    color: '#97A5A4',
    fontSize: 9,
    fontWeight: '700',
  },
  googleButton: {
    minHeight: 41,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#DCE6E8',
    backgroundColor: '#FFFFFF',
  },
  googleText: {
    color: '#71838A',
    fontSize: 10,
  },
  securityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 15,
  },
  securityText: {
    color: '#71838A',
    fontSize: 9,
  },
});
