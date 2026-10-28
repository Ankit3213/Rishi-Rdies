import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type SectionName = 'about' | 'features' | 'how-it-works' | 'contact';

const sectionContent: Record<
  SectionName,
  {
    eyebrow: string;
    title: string;
    description: string;
    items: { icon: keyof typeof MaterialCommunityIcons.glyphMap; title: string; description: string }[];
  }
> = {
  about: {
    eyebrow: 'LOCAL BY NATURE',
    title: 'Made for getting around Rishikesh.',
    description:
      'RishiRide is being built around the everyday journeys that connect people with the places they need to go. Our goal is to make local rides feel simple, clear and comfortable.',
    items: [
      { icon: 'map-marker', title: 'Rooted in Rishikesh', description: 'A ride experience designed for local streets and familiar destinations.' },
      { icon: 'account-heart-outline', title: 'Passenger first', description: 'The current ride journey starts with a passenger account.' },
      { icon: 'handshake-outline', title: 'Built with care', description: 'We are preparing the booking service before accepting ride requests.' },
    ],
  },
  features: {
    eyebrow: 'A BETTER LOCAL RIDE',
    title: 'The essentials, made simple.',
    description:
      'A clear ride experience starts with knowing where you are going and what to expect. These are the features RishiRide is being built to support.',
    items: [
      { icon: 'lightning-bolt-outline', title: 'Quick booking', description: 'Enter a pickup point and destination to get started.' },
      { icon: 'shield-check-outline', title: 'Passenger sign-in', description: 'Sign in as a passenger before starting the ride flow.' },
      { icon: 'currency-inr', title: 'Clear fares', description: 'Fair, upfront ride pricing is part of the planned booking experience.' },
      { icon: 'map-marker-radius-outline', title: 'Local journeys', description: 'A service focused on getting around Rishikesh.' },
    ],
  },
  'how-it-works': {
    eyebrow: 'YOUR JOURNEY',
    title: 'A few simple steps to a ride.',
    description:
      'The landing page lets you enter trip details and takes you to passenger sign-in first. Ride requests will be enabled once the booking service is connected.',
    items: [
      { icon: 'map-marker-path', title: '1. Enter your locations', description: 'Add a pickup point and the destination for your trip.' },
      { icon: 'account-lock-outline', title: '2. Sign in as a passenger', description: 'Book Ride takes you to passenger sign-in before continuing.' },
      { icon: 'rickshaw', title: '3. Request a ride', description: 'Ride requests are not sent until the booking service is available.' },
      { icon: 'check-circle-outline', title: '4. Ride with confidence', description: 'Driver matching and ride updates will follow when booking launches.' },
    ],
  },
  contact: {
    eyebrow: 'WE ARE HERE TO HELP',
    title: 'Questions about RishiRide?',
    description:
      'RishiRide is still preparing its ride booking service. Support contact details will be published here when the service is ready.',
    items: [
      { icon: 'account-circle-outline', title: 'Passenger accounts', description: 'Use passenger sign-in to access the account flow.' },
      { icon: 'information-outline', title: 'Booking availability', description: 'No ride request is sent from this preview yet.' },
      { icon: 'email-outline', title: 'Support channels', description: 'Contact details will be added here before bookings go live.' },
    ],
  },
};

function isSectionName(value: string | undefined): value is SectionName {
  return value === 'about' || value === 'features' || value === 'how-it-works' || value === 'contact';
}

export default function LandingSectionScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const { section } = useLocalSearchParams<{ section?: string }>();
  const [menuOpen, setMenuOpen] = useState(false);
  const desktop = width >= 850;
  const page = isSectionName(section) ? sectionContent[section] : null;

  const navigateTo = (path: '/landing' | '/about' | '/features' | '/how-it-works' | '/contact') => {
    setMenuOpen(false);
    router.push(path);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 8),
          paddingBottom: Math.max(insets.bottom, 24),
        }}
      >
        <View style={[styles.header, styles.contentWidth]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="RishiRide home"
            style={styles.brand}
            onPress={() => navigateTo('/landing')}
          >
            <View style={styles.brandIcon}>
              <MaterialCommunityIcons name="rickshaw" size={27} color="#087C50" />
            </View>
            <View>
              <Text style={styles.brandName}>Rishi<Text style={styles.brandAccent}>Ride</Text></Text>
              <Text style={styles.brandTagline}>Ride Local. Go Far.</Text>
            </View>
          </Pressable>

          {desktop ? (
            <>
              <View style={styles.navigation}>
                <NavButton label="Home" active={false} onPress={() => navigateTo('/landing')} />
                <NavButton label="About" active={section === 'about'} onPress={() => navigateTo('/about')} />
                <NavButton label="Features" active={section === 'features'} onPress={() => navigateTo('/features')} />
                <NavButton label="How It Works" active={section === 'how-it-works'} onPress={() => navigateTo('/how-it-works')} />
                <NavButton label="Contact" active={section === 'contact'} onPress={() => navigateTo('/contact')} />
              </View>
              <Pressable
                accessibilityRole="button"
                style={styles.loginButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </Pressable>
            </>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              accessibilityState={{ expanded: menuOpen }}
              style={styles.mobileMenuButton}
              onPress={() => setMenuOpen((open) => !open)}
            >
              <MaterialCommunityIcons name={menuOpen ? 'close' : 'menu'} size={24} color="#17313A" />
            </Pressable>
          )}
        </View>

        {!desktop && menuOpen && (
          <View style={[styles.mobileMenu, styles.contentWidth]}>
            <NavButton label="Home" active={false} onPress={() => navigateTo('/landing')} />
            <NavButton label="About" active={section === 'about'} onPress={() => navigateTo('/about')} />
            <NavButton label="Features" active={section === 'features'} onPress={() => navigateTo('/features')} />
            <NavButton label="How It Works" active={section === 'how-it-works'} onPress={() => navigateTo('/how-it-works')} />
            <NavButton label="Contact" active={section === 'contact'} onPress={() => navigateTo('/contact')} />
            <Pressable
              accessibilityRole="button"
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.hero}>
          <LinearGradient
            colors={['#F1FAF3', '#EAF7EF', '#F6FBF7']}
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.heroInner}>
            {page ? (
              <>
                <Text style={styles.eyebrow}>{page.eyebrow}</Text>
                <Text style={[styles.title, !desktop && styles.titleMobile]}>{page.title}</Text>
                <Text style={styles.description}>{page.description}</Text>
                <View style={[styles.cards, desktop && styles.cardsDesktop]}>
                  {page.items.map((item) => (
                    <View key={item.title} style={[styles.card, desktop && styles.cardDesktop]}>
                      <View style={styles.cardIcon}>
                        <MaterialCommunityIcons name={item.icon} size={24} color="#087C50" />
                      </View>
                      <Text style={styles.cardTitle}>{item.title}</Text>
                      <Text style={styles.cardDescription}>{item.description}</Text>
                    </View>
                  ))}
                </View>
              </>
            ) : (
              <>
                <Text style={styles.eyebrow}>RISHIRIDE</Text>
                <Text style={styles.title}>Page not found.</Text>
                <Text style={styles.description}>Choose a page from the navigation or return to the home page.</Text>
              </>
            )}
            <View style={styles.actions}>
              <Pressable
                accessibilityRole="button"
                style={styles.primaryButton}
                onPress={() => router.push({ pathname: '/login', params: { role: 'passenger', flow: 'booking' } })}
              >
                <Text style={styles.primaryButtonText}>Sign in as a passenger</Text>
                <MaterialCommunityIcons name="arrow-right" size={19} color="#FFFFFF" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.homeButton}
                onPress={() => navigateTo('/landing')}
              >
                <MaterialCommunityIcons name="arrow-left" size={17} color="#087C50" />
                <Text style={styles.homeButtonText}>Back to Home</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={[styles.footer, styles.contentWidth]}>
          <Text style={styles.footerLogo}>Rishi<Text style={styles.brandAccent}>Ride</Text></Text>
          <Text style={styles.footerText}>Local journeys in Rishikesh.</Text>
          <Text style={styles.copyright}>© 2026 RishiRide.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function NavButton({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable accessibilityRole="button" style={styles.navButton} onPress={onPress}>
      <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
      {active && <View style={styles.navUnderline} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentWidth: {
    width: '90%',
    maxWidth: 1180,
    alignSelf: 'center',
  },
  header: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  brandIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#E5F6E9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandName: {
    color: '#152A32',
    fontSize: 22,
    lineHeight: 25,
    fontWeight: '900',
    letterSpacing: -0.8,
  },
  brandAccent: {
    color: '#078653',
  },
  brandTagline: {
    color: '#53656A',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 1,
  },
  navigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  navButton: {
    minHeight: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navText: {
    color: '#283B41',
    fontSize: 12,
    fontWeight: '700',
  },
  navTextActive: {
    color: '#087C50',
  },
  navUnderline: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: 28,
    borderRadius: 2,
    backgroundColor: '#087C50',
  },
  loginButton: {
    minWidth: 76,
    minHeight: 38,
    borderWidth: 1,
    borderColor: '#078653',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  loginButtonText: {
    color: '#087C50',
    fontSize: 12,
    fontWeight: '700',
  },
  mobileMenuButton: {
    width: 42,
    height: 42,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#EFF8F1',
  },
  mobileMenu: {
    alignSelf: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderColor: '#E8F0EA',
  },
  hero: {
    minHeight: 510,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  heroInner: {
    width: '90%',
    maxWidth: 1000,
    alignSelf: 'center',
    paddingVertical: 55,
  },
  eyebrow: {
    color: '#078653',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },
  title: {
    maxWidth: 740,
    color: '#172A33',
    fontSize: 48,
    lineHeight: 55,
    fontWeight: '900',
    letterSpacing: -1,
    marginTop: 9,
  },
  titleMobile: {
    fontSize: 36,
    lineHeight: 42,
  },
  description: {
    maxWidth: 670,
    color: '#586D75',
    fontSize: 15,
    lineHeight: 23,
    marginTop: 12,
  },
  cards: {
    marginTop: 30,
    gap: 14,
  },
  cardsDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  card: {
    width: '100%',
    minHeight: 138,
    padding: 18,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5EFE8',
  },
  cardDesktop: {
    width: '48%',
  },
  cardIcon: {
    width: 43,
    height: 43,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5F7E8',
    marginBottom: 10,
  },
  cardTitle: {
    color: '#1C3038',
    fontSize: 14,
    fontWeight: '800',
  },
  cardDescription: {
    color: '#687B80',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 26,
  },
  primaryButton: {
    minHeight: 46,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    borderRadius: 11,
    backgroundColor: '#078653',
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  homeButton: {
    minHeight: 44,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  homeButtonText: {
    color: '#087C50',
    fontSize: 12,
    fontWeight: '800',
  },
  footer: {
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 16,
  },
  footerLogo: {
    color: '#17313A',
    fontSize: 17,
    fontWeight: '900',
  },
  footerText: {
    color: '#637477',
    fontSize: 10,
  },
  copyright: {
    color: '#82908F',
    fontSize: 9,
  },
});
