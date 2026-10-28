import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { ReactNode } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type AuthLayoutProps = {
  mode: 'login' | 'signup' | 'otp';
  children: ReactNode;
};

const navigation = [
  { label: 'Home', path: '/landing' },
  { label: 'About', path: '/about' },
  { label: 'Features', path: '/features' },
  { label: 'How It Works', path: '/how-it-works' },
  { label: 'Contact', path: '/contact' },
] as const;

const messages = {
  login: {
    title: 'Welcome Back!',
    description: 'Log in to your RishiRide account and get back on the road.',
  },
  signup: {
    title: 'Join RishiRide',
    description: 'Create your account and start booking rides in seconds.',
  },
  otp: {
    title: 'One quick check.',
    description: 'Verify your mobile number to keep your rides and account secure.',
  },
};

export default function AuthLayout({ mode, children }: AuthLayoutProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const desktop = width >= 920;
  const message = messages[mode];

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 8),
          paddingBottom: Math.max(insets.bottom, 20),
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, styles.contentWidth]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="RishiRide home"
            style={styles.brand}
            onPress={() => router.replace('/landing')}
          >
            <View style={styles.brandIcon}>
              <MaterialCommunityIcons name="rickshaw" size={27} color="#087C50" />
            </View>
            <View>
              <Text style={styles.brandName}>Rishi<Text style={styles.brandAccent}>Ride</Text></Text>
              <Text style={styles.brandTagline}>Ride Local. Go Far.</Text>
            </View>
          </Pressable>

          {desktop && (
            <View style={styles.navigation}>
              {navigation.map((item) => (
                <Pressable
                  accessibilityRole="button"
                  key={item.path}
                  onPress={() => router.push(item.path)}
                >
                  <Text style={styles.navText}>{item.label}</Text>
                </Pressable>
              ))}
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            style={styles.headerAction}
            onPress={() => router.push(mode === 'login' ? '/signup' : '/login')}
          >
            <Text style={styles.headerActionText}>
              {mode === 'login' ? 'Sign up' : 'Login'}
            </Text>
          </Pressable>
        </View>

        <View style={[styles.main, styles.contentWidth, desktop && styles.mainDesktop]}>
          <View style={[styles.story, !desktop && styles.storyMobile]}>
            <LinearGradient
              colors={['#DCEFFC', '#EAF8F0', '#F6F5E9']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.sun} />
            <View style={styles.mountainsBack} />
            <View style={styles.mountainsFront} />
            <View style={styles.river} />
            <View style={styles.storyText}>
              <Text style={[styles.storyTitle, !desktop && styles.storyTitleMobile]}>
                {message.title}
              </Text>
              <Text style={styles.storyDescription}>{message.description}</Text>
              <View style={styles.benefits}>
                <Benefit icon="lightning-bolt" title="Quick & Easy Booking" text="Book your ride in just a few taps." />
                <Benefit icon="map-marker-radius" title="Track Your Ride" text="Follow your journey as it unfolds." />
                <Benefit icon="shield-check" title="Safe & Secure" text="Your safety is our priority." />
              </View>
            </View>
            <MaterialCommunityIcons
              name="rickshaw"
              size={desktop ? 190 : 100}
              color="#087C50"
              style={styles.storyRickshaw}
            />
          </View>

          <View style={[styles.formCard, !desktop && styles.formCardMobile]}>
            {children}
          </View>
        </View>

        <Text style={[styles.footer, styles.contentWidth]}>
          RishiRide · Local journeys in Rishikesh
        </Text>
      </ScrollView>
    </View>
  );
}

function Benefit({
  icon,
  title,
  text,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.benefit}>
      <View style={styles.benefitIcon}>
        <MaterialCommunityIcons name={icon} size={19} color="#087C50" />
      </View>
      <View style={styles.benefitText}>
        <Text style={styles.benefitTitle}>{title}</Text>
        <Text style={styles.benefitDescription}>{text}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FAF8',
  },
  contentWidth: {
    width: '94%',
    maxWidth: 1220,
    alignSelf: 'center',
  },
  header: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    paddingHorizontal: 10,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIcon: {
    width: 39,
    height: 39,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2F4E7',
  },
  brandName: {
    color: '#152A32',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: -0.5,
  },
  brandAccent: {
    color: '#078653',
  },
  brandTagline: {
    color: '#53656A',
    fontSize: 9,
    marginTop: 1,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  navText: {
    color: '#283B41',
    fontSize: 11,
    fontWeight: '700',
  },
  headerAction: {
    minWidth: 68,
    minHeight: 34,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#078653',
  },
  headerActionText: {
    color: '#087C50',
    fontSize: 11,
    fontWeight: '800',
  },
  main: {
    gap: 20,
    paddingTop: 15,
    paddingBottom: 10,
  },
  mainDesktop: {
    minHeight: 560,
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  story: {
    minHeight: 290,
    flex: 1,
    position: 'relative',
    overflow: 'hidden',
    borderRadius: 19,
    justifyContent: 'center',
    padding: 27,
  },
  storyMobile: {
    minHeight: 210,
    padding: 20,
  },
  sun: {
    position: 'absolute',
    top: 35,
    right: 52,
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#FFF0BA',
  },
  mountainsBack: {
    position: 'absolute',
    width: '115%',
    height: '45%',
    bottom: 60,
    left: '-6%',
    borderTopLeftRadius: 180,
    borderTopRightRadius: 140,
    backgroundColor: '#B3D8D0',
    transform: [{ rotate: '-5deg' }],
  },
  mountainsFront: {
    position: 'absolute',
    width: '120%',
    height: '33%',
    bottom: 39,
    left: '-10%',
    borderTopLeftRadius: 140,
    borderTopRightRadius: 160,
    backgroundColor: '#78B999',
    transform: [{ rotate: '4deg' }],
  },
  river: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 42,
    backgroundColor: '#82C6C4',
    opacity: 0.9,
  },
  storyText: {
    zIndex: 1,
    maxWidth: 390,
    marginBottom: 4,
  },
  storyTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    lineHeight: 40,
    fontWeight: '900',
    textShadowColor: 'rgba(20,54,60,0.28)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 7,
  },
  storyTitleMobile: {
    fontSize: 25,
    lineHeight: 30,
  },
  storyDescription: {
    maxWidth: 345,
    color: '#FFFFFF',
    fontSize: 13,
    lineHeight: 20,
    fontWeight: '600',
    textShadowColor: 'rgba(20,54,60,0.34)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
    marginTop: 6,
  },
  benefits: {
    gap: 11,
    marginTop: 22,
  },
  benefit: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  benefitIcon: {
    width: 34,
    height: 34,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  benefitText: {
    flex: 1,
  },
  benefitTitle: {
    color: '#14343B',
    fontSize: 11,
    fontWeight: '900',
  },
  benefitDescription: {
    color: '#35565D',
    fontSize: 9,
    marginTop: 2,
  },
  storyRickshaw: {
    position: 'absolute',
    right: 13,
    bottom: 12,
    zIndex: 1,
  },
  formCard: {
    width: '100%',
    maxWidth: 465,
    alignSelf: 'center',
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    padding: 26,
    elevation: 5,
    shadowColor: '#1C4132',
    shadowOpacity: 0.09,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 5 },
  },
  formCardMobile: {
    maxWidth: 520,
    padding: 21,
  },
  footer: {
    color: '#71817D',
    fontSize: 10,
    textAlign: 'center',
    paddingVertical: 13,
  },
});
