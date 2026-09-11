
import { MaterialCommunityIcons } from '@expo/vector-icons';
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

type UserRole = 'passenger' | 'driver';

export default function SignupScreen() {
  const router = useRouter();

  const [role, setRole] =
    useState<UserRole>('passenger');

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirm, setShowConfirm] =
    useState(false);

  const handleSignup = () => {
    if (
      !name ||
      !mobile ||
      !email ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert(
        'Missing details',
        'Please fill in all fields.'
      );
      return;
    }

    if (mobile.length !== 10) {
      Alert.alert(
        'Invalid mobile',
        'Please enter a valid 10 digit mobile number.'
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        'Password mismatch',
        'Passwords do not match.'
      );
      return;
    }

    Alert.alert(
      'Account Created',
      `Your ${role} account has been created.`,
      [
        {
          text: 'Continue',
          onPress: () =>
            router.replace('/login'),
        },
      ]
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.content}>

          {/* BACK */}

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <MaterialCommunityIcons
              name="arrow-left"
              size={23}
              color="#222"
            />
          </Pressable>

          {/* LOGO */}

          <View style={styles.logoCircle}>
            <MaterialCommunityIcons
              name="rickshaw"
              size={34}
              color="#fff"
            />
          </View>

          <Text style={styles.logoText}>
            RISHIRIDES
          </Text>

          <Text style={styles.title}>
            Create Account
          </Text>

          <Text style={styles.subtitle}>
            Join RishiRides today
          </Text>

          {/* ROLE */}

          <Text style={styles.roleLabel}>
            CREATE ACCOUNT AS
          </Text>

          <View style={styles.roleContainer}>

            {/* PASSENGER */}

            <Pressable
              style={[
                styles.roleButton,
                role === 'passenger' &&
                  styles.roleButtonActive,
              ]}
              onPress={() =>
                setRole('passenger')
              }
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
                      ? '#fff'
                      : '#18a565'
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
                PASSENGER
              </Text>

              {role === 'passenger' && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color="#fff"
                  style={styles.check}
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
              onPress={() =>
                setRole('driver')
              }
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
                      ? '#fff'
                      : '#18a565'
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
                DRIVER
              </Text>

              {role === 'driver' && (
                <MaterialCommunityIcons
                  name="check-circle"
                  size={18}
                  color="#fff"
                  style={styles.check}
                />
              )}
            </Pressable>
          </View>

          {/* NAME */}

          <Input
            icon="account"
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />

          {/* MOBILE */}

          <Input
            icon="phone"
            placeholder="Mobile number"
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
          />

          {/* EMAIL */}

          <Input
            icon="email"
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* PASSWORD */}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock"
              size={21}
              color="#18a565"
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />

            <Pressable
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >
              <MaterialCommunityIcons
                name={
                  showPassword
                    ? 'eye-off'
                    : 'eye'
                }
                size={21}
                color="#777"
              />
            </Pressable>
          </View>

          {/* CONFIRM */}

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="lock-check"
              size={21}
              color="#18a565"
            />

            <TextInput
              style={styles.input}
              placeholder="Confirm password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirm}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <Pressable
              onPress={() =>
                setShowConfirm(!showConfirm)
              }
            >
              <MaterialCommunityIcons
                name={
                  showConfirm
                    ? 'eye-off'
                    : 'eye'
                }
                size={21}
                color="#777"
              />
            </Pressable>
          </View>

          {/* SIGNUP */}

          <Pressable
            style={styles.signupButton}
            onPress={handleSignup}
          >
            <Text style={styles.signupButtonText}>
              CREATE{' '}
              {role === 'passenger'
                ? 'PASSENGER'
                : 'DRIVER'}{' '}
              ACCOUNT
            </Text>

            <MaterialCommunityIcons
              name="arrow-right"
              size={20}
              color="#fff"
            />
          </Pressable>

          {/* LOGIN */}

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <Pressable
              onPress={() =>
                router.push('/login')
              }
            >
              <Text style={styles.loginLink}>
                {' '}
                Login
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

/* ================= INPUT ================= */

function Input({
  icon,
  placeholder,
  value,
  onChangeText,
  keyboardType,
  maxLength,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  placeholder: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: any;
  maxLength?: number;
}) {
  return (
    <View style={styles.inputContainer}>
      <MaterialCommunityIcons
        name={icon}
        size={21}
        color="#18a565"
      />

      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        maxLength={maxLength}
        autoCapitalize="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f6',
  },

  scroll: {
    flexGrow: 1,
    paddingVertical: 30,
  },

  content: {
    width: '90%',
    maxWidth: 430,
    alignSelf: 'center',
    paddingTop: 40,
  },

  backButton: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 3,
  },

  logoCircle: {
    width: 65,
    height: 65,
    borderRadius: 33,
    backgroundColor: '#18a565',
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoText: {
    color: '#18a565',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
    marginTop: 9,
  },

  title: {
    color: '#222',
    fontSize: 29,
    fontWeight: '900',
    textAlign: 'center',
    marginTop: 25,
  },

  subtitle: {
    color: '#777',
    fontSize: 13,
    textAlign: 'center',
    marginTop: 7,
    marginBottom: 20,
  },

  roleLabel: {
    color: '#777',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
    marginBottom: 8,
  },

  roleContainer: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },

  roleButton: {
    flex: 1,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#e1e1e1',
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleButtonActive: {
    backgroundColor: '#18a565',
    borderColor: '#18a565',
  },

  roleIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e8f7f0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleIconActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },

  roleText: {
    color: '#444',
    fontSize: 9,
    fontWeight: '900',
    marginTop: 4,
  },

  roleTextActive: {
    color: '#fff',
  },

  check: {
    position: 'absolute',
    top: 7,
    right: 7,
  },

  inputContainer: {
    height: 55,
    backgroundColor: '#fff',
    borderRadius: 11,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    marginBottom: 12,
  },

  input: {
    flex: 1,
    height: '100%',
    color: '#222',
    fontSize: 14,
    marginLeft: 10,
  },

  signupButton: {
    height: 55,
    borderRadius: 11,
    backgroundColor: '#18a565',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
    marginTop: 8,
  },

  signupButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '900',
  },

  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 23,
  },

  loginText: {
    color: '#777',
    fontSize: 13,
  },

  loginLink: {
    color: '#18a565',
    fontSize: 13,
    fontWeight: '900',
  },
});
