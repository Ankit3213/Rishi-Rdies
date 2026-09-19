import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const desktop = width >= 850;

  return (
    <View style={styles.container}>
      {/* ================= BACKGROUND ================= */}

      <LinearGradient
        colors={[
          '#041814',
          '#06251F',
          '#07382E',
          '#06261F',
          '#031511',
        ]}
        locations={[0, 0.25, 0.52, 0.78, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Soft background glow */}
      <View style={styles.glowTop} />
      <View style={styles.glowLeft} />
      <View style={styles.glowRight} />

      {/* Decorative circles */}
      <View style={styles.circleOne} />
      <View style={styles.circleTwo} />
      <View style={styles.circleThree} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: Math.max(insets.top, 15),
          paddingBottom: 50,
        }}
      >
        {/* ================= HEADER ================= */}

        <View
          style={[
            styles.header,
            desktop && styles.headerDesktop,
          ]}
        >
          {/* LOGO */}

          <Pressable
            style={styles.logoContainer}
            onPress={() => router.replace('/landing')}
          >
            <View style={styles.logoOuter}>
              <LinearGradient
                colors={['#B9FFE5', '#58D9B0']}
                style={styles.logoCircle}
              >
                <MaterialCommunityIcons
                  name="rickshaw"
                  size={27}
                  color="#07362C"
                />
              </LinearGradient>
            </View>

            <View>
              <Text style={styles.logoRishi}>RISHI</Text>
              <Text style={styles.logoRides}>RIDES</Text>
            </View>
          </Pressable>

          {/* DESKTOP NAV */}

          {desktop && (
            <View style={styles.nav}>
              <Text style={styles.navActive}>HOME</Text>
              <Text style={styles.navText}>ABOUT</Text>
              <Text style={styles.navText}>SERVICES</Text>
              <Text style={styles.navText}>CONTACT</Text>
            </View>
          )}

          {/* BUTTONS */}

          <View style={styles.headerButtons}>
            <Pressable
              style={styles.loginButton}
              onPress={() => router.push('/login')}
            >
              <Text style={styles.loginText}>LOGIN</Text>
            </Pressable>

            <Pressable
              style={styles.signupButton}
              onPress={() => router.push('/signup')}
            >
              <Text style={styles.signupText}>SIGN UP</Text>
            </Pressable>
          </View>
        </View>

        {/* ================= HERO ================= */}

        <View
          style={[
            styles.hero,
            desktop && styles.heroDesktop,
          ]}
        >
          {/* ================= LEFT ================= */}

          <View
            style={[
              styles.heroLeft,
              desktop && styles.heroLeftDesktop,
            ]}
          >
            {/* LOCATION */}

            <View style={styles.locationBadge}>
              <View style={styles.locationDot} />

              <MaterialCommunityIcons
                name="map-marker"
                size={15}
                color="#72E4BF"
              />

              <Text style={styles.locationText}>
                RISHIKESH • UTTARAKHAND
              </Text>
            </View>

            {/* TITLE */}

            <Text style={styles.heroTitle}>
              YOUR RIDE.
            </Text>

            <Text style={styles.heroHighlight}>
              YOUR JOURNEY.
            </Text>

            <Text style={styles.heroDescription}>
              Move through Rishikesh with a ride experience
              designed to feel safe, simple and peaceful.
            </Text>

            {/* CTA CARDS */}

            <View style={styles.roleButtons}>
              {/* PASSENGER */}

              <Pressable
                style={styles.passengerButton}
                onPress={() => router.push('/login')}
              >
                <LinearGradient
                  colors={['#B9FFE5', '#65DDB8']}
                  style={styles.roleGradient}
                >
                  <View style={styles.roleIconLight}>
                    <MaterialCommunityIcons
                      name="account"
                      size={25}
                      color="#06382E"
                    />
                  </View>

                  <View style={styles.roleContent}>
                    <Text style={styles.passengerTitle}>
                      I NEED A RIDE
                    </Text>

                    <Text style={styles.passengerDescription}>
                      Find a comfortable ride around Rishikesh
                    </Text>
                  </View>

                  <View style={styles.arrowLight}>
                    <MaterialCommunityIcons
                      name="arrow-right"
                      size={20}
                      color="#06382E"
                    />
                  </View>
                </LinearGradient>
              </Pressable>

              {/* DRIVER */}

              <Pressable
                style={styles.driverButton}
                onPress={() => router.push('/login')}
              >
                <View style={styles.driverInner}>
                  <View style={styles.driverIcon}>
                    <MaterialCommunityIcons
                      name="steering"
                      size={25}
                      color="#77E3C1"
                    />
                  </View>

                  <View style={styles.roleContent}>
                    <Text style={styles.driverTitle}>
                      I WANT TO DRIVE
                    </Text>

                    <Text style={styles.driverDescription}>
                      Drive around the city and earn with us
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={21}
                    color="#78E2C1"
                  />
                </View>
              </Pressable>
            </View>

            {/* TRUST */}

            <View style={styles.trustRow}>
              <TrustItem
                icon="shield-check"
                text="Safe"
              />

              <TrustItem
                icon="clock-fast"
                text="Reliable"
              />

              <TrustItem
                icon="cash"
                text="Fair"
              />

              <TrustItem
                icon="map-marker"
                text="Local"
              />
            </View>
          </View>

          {/* ================= RIGHT 3D AREA ================= */}

          <View
            style={[
              styles.rightSection,
              desktop && styles.rightSectionDesktop,
            ]}
          >
            {/* 3D PLATFORM */}

            <View style={styles.platformShadow} />

            <View style={styles.platform}>
              <LinearGradient
                colors={[
                  'rgba(157,245,216,0.95)',
                  'rgba(72,184,148,0.88)',
                ]}
                style={styles.platformGradient}
              >
                <View style={styles.platformGlow} />

                {/* Floating location */}

                <View style={styles.floatingLocation}>
                  <View style={styles.floatingDot} />

                  <Text style={styles.floatingLocationText}>
                    RISHIKESH
                  </Text>
                </View>

                {/* Rickshaw */}

                <View style={styles.rickshawShadow} />

                <View style={styles.rickshawBody}>
                  <MaterialCommunityIcons
                    name="rickshaw"
                    size={125}
                    color="#063E32"
                  />
                </View>

                {/* Floating card */}

                <View style={styles.floatingRideCard}>
                  <View style={styles.floatingRideIcon}>
                    <MaterialCommunityIcons
                      name="navigation"
                      size={19}
                      color="#0B5D49"
                    />
                  </View>

                  <View>
                    <Text style={styles.floatingRideSmall}>
                      READY TO MOVE
                    </Text>

                    <Text style={styles.floatingRideTitle}>
                      Explore Rishikesh
                    </Text>
                  </View>
                </View>
              </LinearGradient>
            </View>

            {/* RIGHT TEXT */}

            <Text style={styles.rightSmall}>
              MOVE AROUND
            </Text>

            <Text style={styles.rightTitle}>
              RISHIKESH
            </Text>

            <Text style={styles.rightDescription}>
              One peaceful platform for passengers and drivers.
            </Text>

            {/* STATS */}

            <View style={styles.statsRow}>
              <Stat
                number="24/7"
                label="AVAILABLE"
              />

              <Stat
                number="100%"
                label="LOCAL"
              />

              <Stat
                number="₹"
                label="FAIR FARES"
              />
            </View>
          </View>
        </View>

        {/* ================= FEATURES ================= */}

        <View style={styles.features}>
          <Text style={styles.sectionSmall}>
            WHY RISHIRIDES?
          </Text>

          <Text style={styles.sectionTitle}>
            A calmer way to travel.
          </Text>

          <Text style={styles.sectionDescription}>
            Everything you need for simple local transportation.
          </Text>

          <View
            style={[
              styles.featureRow,
              !desktop && styles.featureColumn,
            ]}
          >
            <FeatureCard
              icon="account"
              title="For Passengers"
              text="Find convenient rides and travel comfortably around beautiful Rishikesh."
            />

            <FeatureCard
              icon="steering"
              title="For Drivers"
              text="Drive when you want and earn from rides around the city."
            />

            <FeatureCard
              icon="shield-check"
              title="Safe & Reliable"
              text="A trusted experience designed for peaceful local transportation."
            />
          </View>
        </View>

        {/* ================= BOTTOM CTA ================= */}

        <View style={styles.bottomCTA}>
          <View>
            <Text style={styles.bottomSmall}>
              READY WHEN YOU ARE
            </Text>

            <Text style={styles.bottomTitle}>
              Let's move.
            </Text>
          </View>

          <Pressable
            style={styles.bottomButton}
            onPress={() => router.push('/login')}
          >
            <Text style={styles.bottomButtonText}>
              GET STARTED
            </Text>

            <MaterialCommunityIcons
              name="arrow-right"
              size={21}
              color="#06382E"
            />
          </Pressable>
        </View>

        {/* ================= FOOTER ================= */}

        <View style={styles.footer}>
          <Text style={styles.footerLogo}>
            RISHIRIDES
          </Text>

          <Text style={styles.footerText}>
            Ride calmly. Drive freely. Explore Rishikesh.
          </Text>

          <Text style={styles.copyright}>
            © 2026 RishiRides. Made for Rishikesh.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

/* =====================================================
   TRUST ITEM
===================================================== */

function TrustItem({
  icon,
  text,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.trustItem}>
      <MaterialCommunityIcons
        name={icon}
        size={17}
        color="#79E4C2"
      />

      <Text style={styles.trustText}>
        {text}
      </Text>
    </View>
  );
}

/* =====================================================
   STAT
===================================================== */

function Stat({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statNumber}>
        {number}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

/* =====================================================
   FEATURE CARD
===================================================== */

function FeatureCard({
  icon,
  title,
  text,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  title: string;
  text: string;
}) {
  return (
    <View style={styles.featureCard}>
      <LinearGradient
        colors={[
          'rgba(129,235,200,0.13)',
          'rgba(255,255,255,0.035)',
        ]}
        style={styles.featureCardGradient}
      >
        <View style={styles.featureIcon}>
          <MaterialCommunityIcons
            name={icon}
            size={25}
            color="#07382E"
          />
        </View>

        <Text style={styles.featureTitle}>
          {title}
        </Text>

        <Text style={styles.featureText}>
          {text}
        </Text>
      </LinearGradient>
    </View>
  );
}

/* =====================================================
   STYLES
===================================================== */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#041814',
  },

  /* ================= BACKGROUND ================= */

  glowTop: {
    position: 'absolute',
    width: 450,
    height: 450,
    borderRadius: 225,
    backgroundColor: '#38D6A7',
    opacity: 0.07,
    top: -260,
    right: -140,
  },

  glowLeft: {
    position: 'absolute',
    width: 350,
    height: 350,
    borderRadius: 175,
    backgroundColor: '#42E0B1',
    opacity: 0.045,
    top: 450,
    left: -220,
  },

  glowRight: {
    position: 'absolute',
    width: 400,
    height: 400,
    borderRadius: 200,
    backgroundColor: '#5DE6BD',
    opacity: 0.04,
    bottom: 100,
    right: -250,
  },

  circleOne: {
    position: 'absolute',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 1,
    borderColor: 'rgba(128,235,201,0.09)',
    top: 170,
    right: 50,
  },

  circleTwo: {
    position: 'absolute',
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 1,
    borderColor: 'rgba(128,235,201,0.08)',
    top: 330,
    left: 40,
  },

  circleThree: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(128,235,201,0.05)',
    bottom: 300,
    right: -80,
  },

  /* ================= HEADER ================= */

  header: {
    width: '92%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 13,
  },

  headerDesktop: {
    width: '88%',
    maxWidth: 1400,
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoOuter: {
    width: 51,
    height: 51,
    borderRadius: 18,
    backgroundColor: 'rgba(126,239,202,0.10)',
    padding: 3,
    marginRight: 10,
  },

  logoCircle: {
    flex: 1,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoRishi: {
    color: '#F0FFF9',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 2,
  },

  logoRides: {
    color: '#6FD9B7',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginTop: -1,
  },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 34,
  },

  navActive: {
    color: '#78E6C2',
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 1,
  },

  navText: {
    color: 'rgba(235,255,248,0.62)',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },

  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  loginButton: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(147,237,208,0.30)',
    backgroundColor: 'rgba(255,255,255,0.025)',
  },

  loginText: {
    color: '#DFFFF3',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  signupButton: {
    backgroundColor: '#72E0BC',
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 22,
  },

  signupText: {
    color: '#07362C',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  /* ================= HERO ================= */

  hero: {
    width: '92%',
    alignSelf: 'center',
    paddingTop: 60,
    paddingBottom: 70,
  },

  heroDesktop: {
    width: '88%',
    maxWidth: 1400,
    minHeight: 600,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heroLeft: {
    width: '100%',
  },

  heroLeftDesktop: {
    width: '53%',
  },

  locationBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(137,237,207,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(137,237,207,0.16)',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 25,
    marginBottom: 20,
  },

  locationDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#6EE2BB',
    marginRight: 7,
  },

  locationText: {
    color: '#9DECD3',
    fontSize: 9,
    fontWeight: '900',
    marginLeft: 5,
    letterSpacing: 1.1,
  },

  heroTitle: {
    color: '#F1FFF9',
    fontSize: 49,
    fontWeight: '900',
    lineHeight: 54,
    letterSpacing: -1.2,
  },

  heroHighlight: {
    color: '#70E0BA',
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 59,
    letterSpacing: -1.4,
  },

  heroDescription: {
    color: 'rgba(224,247,239,0.68)',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 18,
    maxWidth: 560,
  },

  /* ================= ROLE BUTTONS ================= */

  roleButtons: {
    marginTop: 30,
    gap: 12,
    maxWidth: 570,
  },

  passengerButton: {
    minHeight: 76,
    borderRadius: 21,
    overflow: 'hidden',
    elevation: 7,
    shadowColor: '#5FE0B7',
    shadowOpacity: 0.15,
    shadowRadius: 15,
    shadowOffset: {
      width: 0,
      height: 7,
    },
  },

  roleGradient: {
    flex: 1,
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  roleIconLight: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.52)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  roleContent: {
    flex: 1,
    marginLeft: 13,
  },

  passengerTitle: {
    color: '#06372D',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  passengerDescription: {
    color: '#397A69',
    fontSize: 11,
    marginTop: 5,
  },

  arrowLight: {
    width: 39,
    height: 39,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  driverButton: {
    minHeight: 76,
    borderRadius: 21,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(140,235,207,0.13)',
    overflow: 'hidden',
  },

  driverInner: {
    flex: 1,
    minHeight: 76,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  driverIcon: {
    width: 48,
    height: 48,
    borderRadius: 17,
    backgroundColor: 'rgba(110,226,188,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  driverTitle: {
    color: '#E9FFF7',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },

  driverDescription: {
    color: 'rgba(214,241,232,0.52)',
    fontSize: 11,
    marginTop: 5,
  },

  /* ================= TRUST ================= */

  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
    marginTop: 27,
  },

  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  trustText: {
    color: 'rgba(228,250,242,0.65)',
    fontSize: 10,
    fontWeight: '800',
    marginLeft: 6,
  },

  /* ================= RIGHT 3D ================= */

  rightSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 60,
  },

  rightSectionDesktop: {
    width: '41%',
    marginTop: 0,
  },

  platformShadow: {
    position: 'absolute',
    width: 260,
    height: 45,
    borderRadius: 100,
    backgroundColor: '#000000',
    opacity: 0.38,
    bottom: 145,
    transform: [{ scaleX: 1.15 }],
  },

  platform: {
    width: 300,
    height: 320,
    borderRadius: 50,
    overflow: 'hidden',
    transform: [{ rotate: '-4deg' }],
    elevation: 18,
    shadowColor: '#4BE0B1',
    shadowOpacity: 0.25,
    shadowRadius: 30,
    shadowOffset: {
      width: 0,
      height: 18,
    },
  },

  platformGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  platformGlow: {
    position: 'absolute',
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: '#FFFFFF',
    opacity: 0.12,
  },

  floatingLocation: {
    position: 'absolute',
    top: 19,
    left: 19,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.76)',
  },

  floatingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#168365',
    marginRight: 6,
  },

  floatingLocationText: {
    color: '#0A5B48',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  rickshawShadow: {
    position: 'absolute',
    width: 170,
    height: 28,
    borderRadius: 100,
    backgroundColor: '#124A3C',
    opacity: 0.25,
    bottom: 76,
  },

  rickshawBody: {
    transform: [{ rotate: '4deg' }],
  },

  floatingRideCard: {
    position: 'absolute',
    right: 12,
    bottom: 20,
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 18,
    padding: 9,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
  },

  floatingRideIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#C7F8E6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  floatingRideSmall: {
    color: '#528477',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.8,
  },

  floatingRideTitle: {
    color: '#164B3E',
    fontSize: 10,
    fontWeight: '900',
    marginTop: 2,
  },

  rightSmall: {
    color: '#67DDB8',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
    marginTop: 27,
  },

  rightTitle: {
    color: '#EFFFF9',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2,
  },

  rightDescription: {
    color: 'rgba(219,246,237,0.55)',
    fontSize: 11,
    marginTop: 5,
    textAlign: 'center',
  },

  /* ================= STATS ================= */

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 22,
  },

  stat: {
    minWidth: 82,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(145,239,211,0.09)',
    alignItems: 'center',
  },

  statNumber: {
    color: '#83E8C7',
    fontSize: 18,
    fontWeight: '900',
  },

  statLabel: {
    color: 'rgba(221,245,237,0.45)',
    fontSize: 7,
    fontWeight: '900',
    marginTop: 4,
    letterSpacing: 0.7,
  },

  /* ================= FEATURES ================= */

  features: {
    width: '92%',
    maxWidth: 1400,
    alignSelf: 'center',
    paddingVertical: 50,
  },

  sectionSmall: {
    color: '#6DDEB9',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 2,
  },

  sectionTitle: {
    color: '#F0FFF9',
    textAlign: 'center',
    fontSize: 29,
    fontWeight: '900',
    marginTop: 7,
  },

  sectionDescription: {
    color: 'rgba(219,245,236,0.50)',
    textAlign: 'center',
    fontSize: 12,
    marginTop: 7,
    marginBottom: 27,
  },

  featureRow: {
    flexDirection: 'row',
    gap: 15,
  },

  featureColumn: {
    flexDirection: 'column',
  },

  featureCard: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(135,236,205,0.10)',
  },

  featureCardGradient: {
    minHeight: 205,
    padding: 22,
  },

  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: '#9AF0D1',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },

  featureTitle: {
    color: '#EFFFF9',
    fontSize: 17,
    fontWeight: '900',
    marginBottom: 8,
  },

  featureText: {
    color: 'rgba(218,243,235,0.56)',
    fontSize: 12,
    lineHeight: 19,
  },

  /* ================= BOTTOM CTA ================= */

  bottomCTA: {
    width: '92%',
    maxWidth: 1400,
    alignSelf: 'center',
    borderRadius: 28,
    backgroundColor: 'rgba(119,226,190,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(119,226,190,0.12)',
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  bottomSmall: {
    color: '#6DDCB7',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1.5,
  },

  bottomTitle: {
    color: '#EDFFF8',
    fontSize: 26,
    fontWeight: '900',
    marginTop: 3,
  },

  bottomButton: {
    backgroundColor: '#B7F7DE',
    borderRadius: 25,
    paddingHorizontal: 17,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  bottomButtonText: {
    color: '#07382E',
    fontSize: 10,
    fontWeight: '900',
  },

  /* ================= FOOTER ================= */

  footer: {
    width: '92%',
    maxWidth: 1400,
    alignSelf: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(138,236,208,0.09)',
    paddingTop: 28,
    marginTop: 50,
  },

  footerLogo: {
    color: '#71DEBA',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 3,
  },

  footerText: {
    color: 'rgba(216,242,234,0.45)',
    fontSize: 11,
    marginTop: 8,
  },

  copyright: {
    color: 'rgba(216,242,234,0.25)',
    fontSize: 9,
    marginTop: 13,
    marginBottom: 10,
  },
});