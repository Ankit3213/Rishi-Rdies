import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type UserRole = 'passenger' | 'driver';

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [role, setRole] = useState<UserRole>('passenger');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    const cleanMobile = mobile.replace(/\D/g, '');

    if (!cleanMobile) {
      Alert.alert(
        'Missing Mobile Number',
        'Please enter your mobile number.'
      );
      return;
    }

    if (cleanMobile.length !== 10) {
      Alert.alert(
        'Invalid Mobile Number',
        'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (!password.trim()) {
      Alert.alert(
        'Missing Password',
        'Please enter your password.'
      );
      return;
    }

    try {
      setLoading(true);

      /*
       * Temporary login.
       *
       * Later your backend API can be connected here.
       */

      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('userRole', role);
      await AsyncStorage.setItem('userMobile', cleanMobile);

      if (role === 'passenger') {
        router.replace('/passenger-dashboard');
      } else {
        router.replace('/driver-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);

      Alert.alert(
        'Login Error',
        'Something went wrong. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: Math.max(insets.top, 20),
            paddingBottom: Math.max(insets.bottom, 30),
          },
        ]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* BACK */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={24}
            color="#0f172a"
          />
        </Pressable>

        {/* LOGO */}
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="rickshaw"
              size={36}
              color="#ffffff"
            />
          </View>

          <Text style={styles.logoText}>RISHI</Text>
          <Text style={styles.logoTextGreen}>RIDES</Text>
        </View>

        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>
          Login to continue with RishiRides
        </Text>

        {/* ROLE */}
        <Text style={styles.label}>LOGIN AS</Text>

        <View style={styles.roleContainer}>
          {/* PASSENGER */}
          <Pressable
            style={[
              styles.roleButton,
              role === 'passenger' &&
                styles.roleButtonActive,
            ]}
            onPress={() => setRole('passenger')}
          >
            <View
              style={[
                styles.roleIcon,
                role === 'passenger' &&
                  styles.roleIconActive,
              ]}
            >
              <MaterialCommunityIcons
                name="account"
                size={24}
                color={
                  role === 'passenger'
                    ? '#ffffff'
                    : '#64748b'
                }
              />
            </View>

            <Text
              style={[
                styles.roleText,
                role === 'passenger' &&
                  styles.roleTextActive,
              ]}
            >
              Passenger
            </Text>

            {role === 'passenger' && (
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#16a34a"
              />
            )}
          </Pressable>

          {/* DRIVER */}
          <Pressable
            style={[
              styles.roleButton,
              role === 'driver' &&
                styles.roleButtonActive,
            ]}
            onPress={() => setRole('driver')}
          >
            <View
              style={[
                styles.roleIcon,
                role === 'driver' &&
                  styles.roleIconActive,
              ]}
            >
              <MaterialCommunityIcons
                name="steering"
                size={24}
                color={
                  role === 'driver'
                    ? '#ffffff'
                    : '#64748b'
                }
              />
            </View>

            <Text
              style={[
                styles.roleText,
                role === 'driver' &&
                  styles.roleTextActive,
              ]}
            >
              Driver
            </Text>

            {role === 'driver' && (
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color="#16a34a"
              />
            )}
          </Pressable>
        </View>

        {/* MOBILE */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>MOBILE NUMBER</Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="phone"
              size={21}
              color="#64748b"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter 10-digit mobile number"
              placeholderTextColor="#94a3b8"
              value={mobile}
              onChangeText={(text) =>
                setMobile(
                  text.replace(/\D/g, '').slice(0, 10)
                )
              }
              keyboardType="phone-pad"
              maxLength={10}
            />
          </View>
        </View>

        {/* PASSWORD */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>PASSWORD</Text>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-outline"
              size={21}
              color="#64748b"
            />

            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              placeholderTextColor="#94a3b8"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />

            <Pressable
              onPress={() =>
                setShowPassword(!showPassword)
              }
              hitSlop={10}
            >
              <MaterialCommunityIcons
                name={
                  showPassword
                    ? 'eye-off'
                    : 'eye'
                }
                size={21}
                color="#64748b"
              />
            </Pressable>
          </View>
        </View>

        {/* FORGOT */}
        <Pressable
          style={styles.forgotButton}
          onPress={() =>
            Alert.alert(
              'Forgot Password',
              'Password recovery will be connected later.'
            )
          }
        >
          <Text style={styles.forgotText}>
            Forgot Password?
          </Text>
        </Pressable>

        {/* LOGIN */}
        <Pressable
          style={[
            styles.loginButton,
            loading &&
              styles.loginButtonDisabled,
          ]}
          onPress={handleLogin}
          disabled={loading}
        >
          <Text style={styles.loginButtonText}>
            {loading
              ? 'LOGGING IN...'
              : `LOGIN AS ${
                  role === 'passenger'
                    ? 'PASSENGER'
                    : 'DRIVER'
                }`}
          </Text>

          {!loading && (
            <MaterialCommunityIcons
              name="arrow-right"
              size={22}
              color="#ffffff"
            />
          )}
        </Pressable>

        {/* SIGNUP */}
        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>
            Don't have an account?
          </Text>

          <Pressable
            onPress={() => router.push('/signup')}
          >
            <Text style={styles.signupLink}>
              {' '}Sign Up
            </Text>
          </Pressable>
        </View>

        {/* SECURITY */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="shield-check"
            size={22}
            color="#16a34a"
          />

          <Text style={styles.infoText}>
            Your information is secure with RishiRides.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  scrollContent: {
    paddingHorizontal: 22,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 25,
  },

  logoCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },

  logoText: {
    fontSize: 28,
    fontWeight: '900',
    color: '#0f172a',
    letterSpacing: 1,
  },

  logoTextGreen: {
    fontSize: 28,
    fontWeight: '900',
    color: '#16a34a',
    letterSpacing: 1,
  },

  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0f172a',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 30,
  },

  label: {
    fontSize: 11,
    fontWeight: '800',
    color: '#475569',
    letterSpacing: 0.8,
    marginBottom: 8,
  },

  roleContainer: {
    gap: 10,
    marginBottom: 25,
  },

  roleButton: {
    minHeight: 68,
    borderRadius: 15,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  roleButtonActive: {
    borderColor: '#16a34a',
    backgroundColor: '#f0fdf4',
  },

  roleIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  roleIconActive: {
    backgroundColor: '#16a34a',
  },

  roleText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '700',
    color: '#475569',
  },

  roleTextActive: {
    color: '#15803d',
  },

  inputGroup: {
    marginBottom: 18,
  },

  inputContainer: {
    height: 56,
    backgroundColor: '#ffffff',
    borderRadius: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: '#0f172a',
    marginLeft: 10,
  },

  forgotButton: {
    alignSelf: 'flex-end',
    marginBottom: 25,
  },

  forgotText: {
    color: '#16a34a',
    fontSize: 13,
    fontWeight: '700',
  },

  loginButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
    gap: 10,
  },

  loginButtonDisabled: {
    opacity: 0.6,
  },

  loginButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },

  signupText: {
    color: '#64748b',
    fontSize: 14,
  },

  signupLink: {
    color: '#16a34a',
    fontSize: 14,
    fontWeight: '800',
  },

  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
    paddingHorizontal: 15,
  },

  infoText: {
    color: '#64748b',
    fontSize: 11,
    marginLeft: 7,
  },
});