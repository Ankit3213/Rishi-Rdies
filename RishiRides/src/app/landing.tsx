import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const desktop = width >= 850;

  const handleBookRide = () => {
    router.push({
      pathname: '/login',
      params: { role: 'passenger', flow: 'booking' },
    });
  };

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
              <Text style={styles.brandName}>
                Rishi<Text style={styles.brandAccent}>Ride</Text>
              </Text>
              <Text style={styles.brandTagline}>Ride Local. Go Far.</Text>
            </View>
          </Pressable>

          {desktop && (
            <View style={styles.navigation}>
              <NavButton label="Home" active onPress={() => navigateTo('/landing')} />
              <NavButton label="About" onPress={() => navigateTo('/about')} />
              <NavButton label="Features" onPress={() => navigateTo('/features')} />
              <NavButton label="How It Works" onPress={() => navigateTo('/how-it-works')} />
              <NavButton label="Contact" onPress={() => navigateTo('/contact')} />
            </View>
          )}

          {desktop ? (
            <View style={styles.headerActions}>
              <Pressable
                accessibilityRole="button"
                style={styles.loginButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.signupButton}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              accessibilityState={{ expanded: menuOpen }}
              style={styles.mobileMenuButton}
              onPress={() => setMenuOpen((open) => !open)}
            >
              <MaterialCommunityIcons
                name={menuOpen ? 'close' : 'menu'}
                size={24}
                color="#17313A"
              />
            </Pressable>
          )}
        </View>

        {!desktop && menuOpen && (
          <View style={[styles.mobileMenu, styles.contentWidth]}>
            <NavButton label="Home" active onPress={() => navigateTo('/landing')} />
            <NavButton label="About" onPress={() => navigateTo('/about')} />
            <NavButton label="Features" onPress={() => navigateTo('/features')} />
            <NavButton label="How It Works" onPress={() => navigateTo('/how-it-works')} />
            <NavButton label="Contact" onPress={() => navigateTo('/contact')} />
            <View style={styles.mobileMenuActions}>
              <Pressable
                accessibilityRole="button"
                style={styles.loginButton}
                onPress={() => router.push('/login')}
              >
                <Text style={styles.loginButtonText}>Login</Text>
              </Pressable>
              <Pressable
                accessibilityRole="button"
                style={styles.signupButton}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.signupButtonText}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
        )}

        <View style={styles.heroSection}>
          <View style={[styles.hero, styles.contentWidth, desktop && styles.heroDesktop]}>
            <View style={[styles.heroCopy, desktop && styles.heroCopyDesktop]}>
              <View style={styles.promisePill}>
                <MaterialCommunityIcons name="map-marker" size={15} color="#078653" />
                <Text style={styles.promiseText}>Fast</Text>
                <Text style={styles.promiseSeparator}>·</Text>
                <Text style={styles.promiseText}>Safe</Text>
                <Text style={styles.promiseSeparator}>·</Text>
                <Text style={styles.promiseText}>Affordable</Text>
              </View>

              <Text style={[styles.heroTitle, !desktop && styles.heroTitleMobile]}>
                Book a Rickshaw{'\n'}in <Text style={styles.heroTitleAccent}>Seconds</Text>
              </Text>
              <Text style={styles.heroDescription}>
                RishiRide connects you with nearby rickshaw drivers for a safe, comfortable and affordable ride.
                Whether it&apos;s a short trip or a long journey, we&apos;ve got you covered.
              </Text>

              <View style={[styles.bookingCard, !desktop && styles.bookingCardMobile]}>
                <View style={styles.locationField}>
                  <MaterialCommunityIcons name="map-marker" size={21} color="#078653" />
                  <View style={styles.locationInputWrap}>
                    <Text style={styles.locationLabel}>From</Text>
                    <TextInput
                      accessibilityLabel="Pickup location"
                      value={pickup}
                      onChangeText={setPickup}
                      placeholder="Your location"
                      placeholderTextColor="#93A2A0"
                      returnKeyType="next"
                      style={styles.locationInput}
                    />
                  </View>
                </View>

                <View style={styles.fieldDivider} />

                <View style={styles.locationField}>
                  <MaterialCommunityIcons name="map-marker" size={21} color="#078653" />
                  <View style={styles.locationInputWrap}>
                    <Text style={styles.locationLabel}>To</Text>
                    <TextInput
                      accessibilityLabel="Destination"
                      value={destination}
                      onChangeText={setDestination}
                      placeholder="Destination"
                      placeholderTextColor="#93A2A0"
                      returnKeyType="done"
                      onSubmitEditing={handleBookRide}
                      style={styles.locationInput}
                    />
                  </View>
                </View>

                <Pressable
                  accessibilityRole="button"
                  style={[styles.bookButton, !desktop && styles.bookButtonMobile]}
                  onPress={handleBookRide}
                >
                  <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
                  <Text style={styles.bookButtonText}>Book Ride</Text>
                </Pressable>
              </View>

              <View style={styles.trustRow}>
                <TrustItem icon="shield-check" label="Verified Drivers" />
                <View style={styles.trustDivider} />
                <TrustItem icon="clock-fast" label="Quick Booking" />
                <View style={styles.trustDivider} />
                <TrustItem icon="cash" label="Affordable Fares" />
              </View>
            </View>

            <View style={[styles.heroArt, !desktop && styles.heroArtMobile]}>
              <LinearGradient
                colors={['#DCEFFC', '#EAF8F0', '#F6F5E9']}
                style={StyleSheet.absoluteFill}
              />
              <View style={styles.sun} />
              <View style={styles.cityline}>
                <View style={[styles.building, styles.buildingOne]} />
                <View style={[styles.building, styles.buildingTwo]} />
                <View style={[styles.building, styles.buildingThree]} />
                <View style={[styles.building, styles.buildingFour]} />
                <View style={[styles.building, styles.buildingFive]} />
              </View>
              <View style={styles.hillsBack} />
              <View style={styles.hillsFront} />
              <View style={styles.road} />
              <View style={styles.roadStripe} />
              <View style={styles.rickshawGlow} />
              <MaterialCommunityIcons
                name="rickshaw"
                size={desktop ? 250 : Math.min(width * 0.63, 250)}
                color="#087C50"
                style={styles.heroRickshaw}
              />
              <View style={styles.artLabel}>
                <Text style={styles.artLabelText}>Your Ride</Text>
                <Text style={styles.artLabelText}>Our Priority</Text>
                <View style={styles.artLabelUnderline} />
              </View>
              <View style={styles.artBadge}>
                <View style={styles.onlineDot} />
                <Text style={styles.artBadgeText}>READY FOR YOUR NEXT RIDE</Text>
              </View>
            </View>
          </View>
        </View>

        <View
          style={[styles.aboutSection, styles.sectionInner]}
        >
          <View style={[styles.aboutCopy, desktop && styles.aboutCopyDesktop]}>
            <Text style={styles.eyebrow}>WHY CHOOSE RISHIRIDE?</Text>
            <Text style={styles.sectionTitle}>Smart Rides, Better Journeys</Text>
            <Text style={styles.sectionDescription}>
              We make your travel simple, safe and stress-free with our easy-to-use platform and reliable rickshaw services.
            </Text>

            <View
              style={[styles.featuresGrid, desktop && styles.featuresGridDesktop]}
            >
              <Feature
                icon="lightning-bolt"
                title="Quick Booking"
                description="Get a ride in just a few taps."
                desktop={desktop}
              />
              <Feature
                icon="shield-check"
                title="Safe & Trusted"
                description="Verified drivers and real-time tracking."
                desktop={desktop}
              />
              <Feature
                icon="currency-inr"
                title="Affordable Fares"
                description="No hidden charges, just fair prices."
                desktop={desktop}
              />
              <Feature
                icon="map-marker"
                title="Anywhere, Anytime"
                description="Ride to your destination whenever you need."
                desktop={desktop}
              />
            </View>
          </View>

          <View style={[styles.appShowcase, !desktop && styles.appShowcaseMobile]}>
            <View style={styles.phoneFrame}>
              <View style={styles.phoneNotch} />
              <View style={styles.phoneHeader}>
                <View style={styles.phoneLogo}>
                  <MaterialCommunityIcons name="rickshaw" size={22} color="#087C50" />
                </View>
                <Text style={styles.phoneBrand}>RishiRide</Text>
              </View>
              <View style={styles.mapPanel}>
                <View style={styles.mapRoadOne} />
                <View style={styles.mapRoadTwo} />
                <View style={styles.mapRoadThree} />
                <View style={styles.mapRoute} />
                <View style={styles.mapPinStart}>
                  <MaterialCommunityIcons name="map-marker" size={19} color="#087C50" />
                </View>
                <View style={styles.mapPinEnd}>
                  <MaterialCommunityIcons name="map-marker" size={23} color="#087C50" />
                </View>
              </View>
              <View style={styles.phoneTripCard}>
                <TripLocation icon="circle-small" title="Pickup Location" value="Your Location" />
                <TripLocation icon="map-marker" title="Drop Location" value="Destination" />
              </View>
              <View style={styles.phoneRideCard}>
                <MaterialCommunityIcons name="rickshaw" size={30} color="#087C50" />
                <View style={styles.phoneRideCopy}>
                  <Text style={styles.phoneRideTitle}>Auto Rickshaw</Text>
                  <Text style={styles.phoneRideSub}>A comfortable local ride</Text>
                </View>
                <Text style={styles.phoneRidePrice}>₹</Text>
              </View>
              <View style={styles.phoneBookButton}>
                <Text style={styles.phoneBookText}>Book Ride</Text>
              </View>
            </View>
            <View style={styles.downloadCopy}>
              <Text style={styles.downloadTitle}>A better ride is just a tap away.</Text>
              <Text style={styles.downloadText}>
                Simple local journeys, thoughtfully brought together in one place.
              </Text>
              <Pressable
                accessibilityRole="button"
                style={styles.downloadButton}
                onPress={() => router.push('/signup')}
              >
                <MaterialCommunityIcons name="account-plus-outline" size={19} color="#FFFFFF" />
                <Text style={styles.downloadButtonText}>Get started</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View
          style={styles.howSection}
        >
          <View style={styles.sectionInner}>
            <Text style={styles.sectionTitleCentered}>How It Works</Text>
            <Text style={styles.sectionDescriptionCentered}>
              Booking a rickshaw with RishiRide is super easy!
            </Text>
            <View style={[styles.stepsRow, !desktop && styles.stepsColumn]}>
              <Step
                number="1"
                icon="map-marker-path"
                title="Set Location"
                description="Enter your pickup and drop location."
              />
              <StepArrow desktop={desktop} />
              <Step
                number="2"
                icon="account-lock"
                title="Sign In"
                description="Continue securely as a passenger."
              />
              <StepArrow desktop={desktop} />
              <Step
                number="3"
                icon="rickshaw"
                title="Request a Ride"
                description="Ride requests will be enabled when booking launches."
              />
              <StepArrow desktop={desktop} />
              <Step
                number="4"
                icon="check-circle"
                title="Ride & Enjoy"
                description="Driver matching will follow when the booking service is ready."
              />
            </View>
          </View>
        </View>

        <View style={styles.ctaSection}>
          <LinearGradient
            colors={['#052B22', '#074D39', '#087C50']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.ctaGradient}
          >
            <View style={[styles.ctaContent, styles.contentWidth, !desktop && styles.ctaContentMobile]}>
              <View style={styles.ctaCopy}>
                <Text style={styles.ctaKicker}>LET&apos;S RIDE TOGETHER</Text>
                <Text style={styles.ctaTitle}>Your next ride starts here.</Text>
                <Text style={styles.ctaDescription}>Local rides. A smoother way to get there.</Text>
              </View>
              <Pressable
                accessibilityRole="button"
                style={styles.ctaButton}
                onPress={() => router.push('/signup')}
              >
                <Text style={styles.ctaButtonText}>Get Started</Text>
                <MaterialCommunityIcons name="arrow-right" size={19} color="#073E2D" />
              </Pressable>
            </View>
          </LinearGradient>
        </View>

        <View style={[styles.footer, styles.contentWidth]}>
          <View style={styles.footerBrand}>
            <Text style={styles.footerLogo}>
              Rishi<Text style={styles.brandAccent}>Ride</Text>
            </Text>
            <Text style={styles.footerTagline}>Ride Local. Go Far.</Text>
          </View>
          <Text style={styles.footerText}>Made for local journeys in Rishikesh.</Text>
          <Text style={styles.copyright}>© 2026 RishiRide. All rights reserved.</Text>
        </View>
      </ScrollView>
    </View>
  );
}

function NavButton({
  label,
  active = false,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      style={styles.navButton}
      onPress={onPress}
    >
      <Text style={[styles.navText, active && styles.navTextActive]}>{label}</Text>
      {active && <View style={styles.navUnderline} />}
    </Pressable>
  );
}

function TrustItem({
  icon,
  label,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
}) {
  return (
    <View style={styles.trustItem}>
      <MaterialCommunityIcons name={icon} size={17} color="#15343B" />
      <Text style={styles.trustText}>{label}</Text>
    </View>
  );
}

function Feature({
  icon,
  title,
  description,
  desktop,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
  desktop: boolean;
}) {
  return (
    <View style={[styles.feature, desktop && styles.featureDesktop]}>
      <View style={styles.featureIcon}>
        <MaterialCommunityIcons name={icon} size={24} color="#087C50" />
      </View>
      <View style={styles.featureCopy}>
        <Text style={styles.featureTitle}>{title}</Text>
        <Text style={styles.featureDescription}>{description}</Text>
      </View>
    </View>
  );
}

function TripLocation({
  icon,
  title,
  value,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.tripLocation}>
      <MaterialCommunityIcons name={icon} size={16} color="#078653" />
      <View>
        <Text style={styles.tripLocationTitle}>{title}</Text>
        <Text style={styles.tripLocationValue}>{value}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={17} color="#657672" />
    </View>
  );
}

function Step({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  description: string;
}) {
  return (
    <View style={styles.step}>
      <View style={styles.stepIcon}>
        <MaterialCommunityIcons name={icon} size={31} color="#087C50" />
      </View>
      <Text style={styles.stepTitle}>{number}. {title}</Text>
      <Text style={styles.stepDescription}>{description}</Text>
    </View>
  );
}

function StepArrow({ desktop }: { desktop: boolean }) {
  return (
    <MaterialCommunityIcons
      name={desktop ? 'chevron-right' : 'chevron-down'}
      size={25}
      color="#078653"
      style={styles.stepArrow}
    />
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
  sectionInner: {
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
    gap: 22,
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
  mobileMenuActions: {
    flexDirection: 'row',
    gap: 9,
    paddingVertical: 8,
  },
  navButton: {
    minHeight: 38,
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
    width: 27,
    borderRadius: 2,
    backgroundColor: '#087C50',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
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
  signupButton: {
    minWidth: 83,
    minHeight: 38,
    borderRadius: 10,
    backgroundColor: '#078653',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 13,
  },
  signupButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  heroSection: {
    backgroundColor: '#F3FAF5',
    overflow: 'hidden',
  },
  hero: {
    paddingTop: 42,
    paddingBottom: 45,
    gap: 34,
  },
  heroDesktop: {
    minHeight: 445,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  heroCopy: {
    width: '100%',
  },
  heroCopyDesktop: {
    width: '52%',
  },
  promisePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#14352B',
    shadowOpacity: 0.08,
    shadowRadius: 7,
    shadowOffset: { width: 0, height: 2 },
  },
  promiseText: {
    color: '#25363C',
    fontSize: 11,
    fontWeight: '700',
  },
  promiseSeparator: {
    color: '#84928F',
    fontSize: 13,
  },
  heroTitle: {
    color: '#172A33',
    fontSize: 52,
    lineHeight: 57,
    fontWeight: '900',
    letterSpacing: -1.5,
  },
  heroTitleMobile: {
    fontSize: 42,
    lineHeight: 47,
  },
  heroTitleAccent: {
    color: '#087C50',
  },
  heroDescription: {
    maxWidth: 490,
    color: '#586D75',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 12,
  },
  bookingCard: {
    minHeight: 76,
    maxWidth: 570,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 9,
    marginTop: 22,
    elevation: 5,
    shadowColor: '#163B2D',
    shadowOpacity: 0.1,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 5 },
  },
  bookingCardMobile: {
    maxWidth: 520,
    flexWrap: 'wrap',
    gap: 4,
  },
  locationField: {
    minWidth: 0,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 7,
  },
  locationInputWrap: {
    flex: 1,
    minWidth: 0,
  },
  locationLabel: {
    color: '#33474D',
    fontSize: 10,
    fontWeight: '700',
  },
  locationInput: {
    minWidth: 0,
    padding: 0,
    height: 22,
    color: '#23373E',
    fontSize: 12,
  },
  fieldDivider: {
    width: 1,
    height: 38,
    backgroundColor: '#DCE5E1',
    marginHorizontal: 4,
  },
  bookButton: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 16,
    backgroundColor: '#078653',
    borderRadius: 11,
  },
  bookButtonMobile: {
    width: '100%',
    marginTop: 5,
  },
  bookButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  trustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 15,
    marginTop: 23,
  },
  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  trustText: {
    color: '#263A40',
    fontSize: 10,
    fontWeight: '700',
  },
  trustDivider: {
    width: 1,
    height: 15,
    backgroundColor: '#D8E5DE',
  },
  heroArt: {
    width: '43%',
    height: 355,
    alignSelf: 'center',
    borderRadius: 22,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroArtMobile: {
    width: '100%',
    height: 300,
    marginTop: 10,
  },
  sun: {
    position: 'absolute',
    top: 35,
    right: 56,
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#FFF0BA',
    opacity: 0.9,
  },
  cityline: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 90,
    height: 125,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    opacity: 0.5,
  },
  building: {
    width: '13%',
    backgroundColor: '#A8C5C6',
  },
  buildingOne: { height: '45%' },
  buildingTwo: { height: '82%' },
  buildingThree: { height: '60%' },
  buildingFour: { height: '95%' },
  buildingFive: { height: '53%' },
  hillsBack: {
    position: 'absolute',
    left: -20,
    right: -20,
    bottom: 70,
    height: 95,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: '#B7DCC8',
    transform: [{ scaleX: 1.15 }],
  },
  hillsFront: {
    position: 'absolute',
    left: -35,
    right: -35,
    bottom: 47,
    height: 90,
    borderTopLeftRadius: 100,
    borderTopRightRadius: 100,
    backgroundColor: '#80BA91',
    transform: [{ scaleX: 1.1 }],
  },
  road: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 63,
    backgroundColor: '#576965',
  },
  roadStripe: {
    position: 'absolute',
    bottom: 28,
    left: '12%',
    width: '76%',
    height: 3,
    borderRadius: 2,
    backgroundColor: '#F7E9AD',
  },
  rickshawGlow: {
    position: 'absolute',
    bottom: 64,
    width: 195,
    height: 62,
    borderRadius: 100,
    backgroundColor: '#315746',
    opacity: 0.19,
  },
  heroRickshaw: {
    position: 'absolute',
    bottom: 57,
    textShadowColor: 'rgba(255,255,255,0.55)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  artLabel: {
    position: 'absolute',
    top: 34,
    left: 23,
    transform: [{ rotate: '-7deg' }],
  },
  artLabelText: {
    color: '#17363B',
    fontSize: 17,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  artLabelUnderline: {
    width: 48,
    height: 2,
    backgroundColor: '#087C50',
    marginTop: 4,
    transform: [{ rotate: '-12deg' }],
  },
  artBadge: {
    position: 'absolute',
    right: 12,
    bottom: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 9,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
  },
  onlineDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#078653',
  },
  artBadgeText: {
    color: '#334940',
    fontSize: 8,
    fontWeight: '800',
  },
  aboutSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 35,
    paddingTop: 49,
    paddingBottom: 44,
  },
  aboutCopy: {
    width: '100%',
  },
  aboutCopyDesktop: {
    width: '51%',
  },
  eyebrow: {
    color: '#078653',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  sectionTitle: {
    color: '#192D36',
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '900',
    marginTop: 7,
  },
  sectionDescription: {
    maxWidth: 500,
    color: '#61747A',
    fontSize: 13,
    lineHeight: 20,
    marginTop: 8,
  },
  featuresGrid: {
    marginTop: 24,
    gap: 16,
  },
  featuresGridDesktop: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  feature: {
    width: '100%',
    minHeight: 70,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5EEE9',
    paddingBottom: 12,
  },
  featureDesktop: {
    width: '48%',
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5F7E8',
  },
  featureCopy: {
    flex: 1,
  },
  featureTitle: {
    color: '#1C3038',
    fontSize: 13,
    fontWeight: '800',
  },
  featureDescription: {
    color: '#687B80',
    fontSize: 11,
    lineHeight: 16,
    marginTop: 3,
  },
  appShowcase: {
    flex: 1,
    minHeight: 360,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    borderRadius: 28,
    backgroundColor: '#F2FAF3',
    padding: 22,
  },
  appShowcaseMobile: {
    width: '100%',
    flexDirection: 'column',
    marginTop: 24,
  },
  phoneFrame: {
    width: 178,
    minHeight: 314,
    overflow: 'hidden',
    padding: 10,
    paddingTop: 18,
    borderWidth: 5,
    borderColor: '#17252A',
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    elevation: 8,
    shadowColor: '#163B2D',
    shadowOpacity: 0.18,
    shadowRadius: 13,
    shadowOffset: { width: 0, height: 7 },
  },
  phoneNotch: {
    position: 'absolute',
    zIndex: 1,
    width: 55,
    height: 11,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    top: 0,
    alignSelf: 'center',
    backgroundColor: '#17252A',
  },
  phoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    height: 31,
    marginBottom: 7,
  },
  phoneLogo: {
    width: 27,
    height: 27,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E5F7E8',
  },
  phoneBrand: {
    color: '#1A3335',
    fontSize: 12,
    fontWeight: '900',
  },
  mapPanel: {
    height: 113,
    overflow: 'hidden',
    position: 'relative',
    borderRadius: 12,
    backgroundColor: '#F2F6F1',
  },
  mapRoadOne: {
    position: 'absolute',
    top: 0,
    left: '28%',
    width: 9,
    height: '120%',
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '29deg' }],
  },
  mapRoadTwo: {
    position: 'absolute',
    top: '39%',
    left: '-10%',
    width: '125%',
    height: 8,
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-19deg' }],
  },
  mapRoadThree: {
    position: 'absolute',
    top: '6%',
    right: '22%',
    width: 8,
    height: '120%',
    backgroundColor: '#FFFFFF',
    transform: [{ rotate: '-36deg' }],
  },
  mapRoute: {
    position: 'absolute',
    top: '48%',
    left: '24%',
    width: '48%',
    height: 3,
    backgroundColor: '#087C50',
    transform: [{ rotate: '-32deg' }],
  },
  mapPinStart: {
    position: 'absolute',
    left: '18%',
    bottom: '21%',
  },
  mapPinEnd: {
    position: 'absolute',
    top: '10%',
    right: '23%',
  },
  phoneTripCard: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginTop: 8,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  tripLocation: {
    minHeight: 37,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#EDF1EE',
  },
  tripLocationTitle: {
    color: '#87928D',
    fontSize: 8,
  },
  tripLocationValue: {
    color: '#293C3A',
    fontSize: 9,
    fontWeight: '700',
    marginTop: 2,
  },
  phoneRideCard: {
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 7,
  },
  phoneRideCopy: {
    flex: 1,
  },
  phoneRideTitle: {
    color: '#273C39',
    fontSize: 9,
    fontWeight: '800',
  },
  phoneRideSub: {
    color: '#74827C',
    fontSize: 7,
    marginTop: 2,
  },
  phoneRidePrice: {
    color: '#087C50',
    fontSize: 15,
    fontWeight: '900',
  },
  phoneBookButton: {
    minHeight: 29,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 9,
    backgroundColor: '#078653',
    marginTop: 3,
  },
  phoneBookText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
  },
  downloadCopy: {
    flex: 1,
    maxWidth: 205,
  },
  downloadTitle: {
    color: '#17363B',
    fontSize: 20,
    lineHeight: 25,
    fontWeight: '900',
  },
  downloadText: {
    color: '#5D7274',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 9,
  },
  downloadButton: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 13,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#078653',
    marginTop: 15,
  },
  downloadButtonText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  howSection: {
    backgroundColor: '#FBFDFC',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#EDF2EE',
    paddingVertical: 34,
  },
  sectionTitleCentered: {
    color: '#192D36',
    fontSize: 25,
    lineHeight: 31,
    fontWeight: '900',
    textAlign: 'center',
  },
  sectionDescriptionCentered: {
    color: '#65777D',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 4,
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 24,
  },
  stepsColumn: {
    flexDirection: 'column',
    gap: 8,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  stepIcon: {
    width: 69,
    height: 69,
    borderRadius: 35,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E2F5E5',
  },
  stepTitle: {
    color: '#263A40',
    fontSize: 12,
    fontWeight: '800',
    textAlign: 'center',
    marginTop: 9,
  },
  stepDescription: {
    maxWidth: 155,
    color: '#708087',
    fontSize: 11,
    lineHeight: 16,
    textAlign: 'center',
    marginTop: 5,
  },
  stepArrow: {
    flexShrink: 0,
  },
  ctaSection: {
    marginTop: 0,
  },
  ctaGradient: {
    paddingVertical: 35,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
  },
  ctaContentMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  ctaCopy: {
    flex: 1,
  },
  ctaKicker: {
    color: '#A7E9CC',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  ctaTitle: {
    color: '#FFFFFF',
    fontSize: 27,
    lineHeight: 34,
    fontWeight: '900',
    marginTop: 5,
  },
  ctaDescription: {
    color: '#C6DDD1',
    fontSize: 12,
    marginTop: 5,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 17,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: '#C8F3D8',
  },
  ctaButtonText: {
    color: '#073E2D',
    fontSize: 12,
    fontWeight: '900',
  },
  footer: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 10,
    paddingVertical: 18,
  },
  footerBrand: {
    alignItems: 'flex-start',
  },
  footerLogo: {
    color: '#17313A',
    fontSize: 17,
    fontWeight: '900',
  },
  footerTagline: {
    color: '#637477',
    fontSize: 9,
    marginTop: 2,
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
