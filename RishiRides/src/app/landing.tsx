
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const BACKGROUND_IMAGE =
  'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=2000&q=85';

export default function LandingScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const desktop = width >= 850;

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: BACKGROUND_IMAGE }}
        resizeMode="cover"
        style={styles.background}
      >
        <View style={styles.overlay} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingTop: Math.max(insets.top, 15),
            paddingBottom: 40,
          }}
        >
          {/* ================= HEADER ================= */}

          <View
            style={[
              styles.header,
              desktop && styles.headerDesktop,
            ]}
          >
            <Pressable
              style={styles.logoContainer}
              onPress={() => router.replace('/landing')}
            >
              <View style={styles.logoCircle}>
                <MaterialCommunityIcons
                  name="rickshaw"
                  size={27}
                  color="#fff"
                />
              </View>

              <View>
                <Text style={styles.logoRishi}>RISHI</Text>
                <Text style={styles.logoRides}>RIDES</Text>
              </View>
            </Pressable>

            {desktop && (
              <View style={styles.nav}>
                <Text style={styles.navActive}>HOME</Text>
                <Text style={styles.navText}>ABOUT</Text>
                <Text style={styles.navText}>SERVICES</Text>
                <Text style={styles.navText}>CONTACT</Text>
              </View>
            )}

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
            <View
              style={[
                styles.heroLeft,
                desktop && styles.heroLeftDesktop,
              ]}
            >
              <View style={styles.locationBadge}>
                <MaterialCommunityIcons
                  name="map-marker"
                  size={16}
                  color="#fff"
                />

                <Text style={styles.locationText}>
                  RISHIKESH, UTTARAKHAND
                </Text>
              </View>

              <Text style={styles.heroTitle}>
                YOUR RIDE.
              </Text>

              <Text style={styles.heroHighlight}>
                YOUR JOURNEY.
              </Text>

              <Text style={styles.heroDescription}>
                RishiRides connects passengers and drivers
                across Rishikesh with safe, reliable and
                affordable transportation.
              </Text>

              {/* ================= TWO OPTIONS ================= */}

              <View style={styles.roleButtons}>
                {/* PASSENGER */}

                <Pressable
                  style={styles.roleButton}
                  onPress={() => router.push('/login')}
                >
                  <View style={styles.roleIcon}>
                    <MaterialCommunityIcons
                      name="account"
                      size={25}
                      color="#fff"
                    />
                  </View>

                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>
                      I NEED A RIDE
                    </Text>

                    <Text style={styles.roleDescription}>
                      Book a ride around Rishikesh
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={21}
                    color="#fff"
                  />
                </Pressable>

                {/* DRIVER */}

                <Pressable
                  style={styles.driverRoleButton}
                  onPress={() => router.push('/login')}
                >
                  <View style={styles.driverIcon}>
                    <MaterialCommunityIcons
                      name="steering"
                      size={25}
                      color="#18a565"
                    />
                  </View>

                  <View style={styles.roleContent}>
                    <Text style={styles.driverRoleTitle}>
                      I WANT TO DRIVE
                    </Text>

                    <Text style={styles.driverRoleDescription}>
                      Earn by driving with RishiRides
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={21}
                    color="#18a565"
                  />
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
                  text="Fast"
                />

                <TrustItem
                  icon="cash"
                  text="Affordable"
                />

                <TrustItem
                  icon="map-marker"
                  text="Rishikesh"
                />
              </View>
            </View>

            {/* ================= RIGHT SIDE ================= */}

            <View
              style={[
                styles.rightSection,
                desktop && styles.rightSectionDesktop,
              ]}
            >
              <View style={styles.illustrationCircle}>
                <MaterialCommunityIcons
                  name="rickshaw"
                  size={105}
                  color="#18a565"
                />
              </View>

              <Text style={styles.rightTitle}>
                MOVE AROUND
              </Text>

              <Text style={styles.rightHighlight}>
                RISHIKESH
              </Text>

              <Text style={styles.rightDescription}>
                One platform for passengers and drivers.
              </Text>

              <View style={styles.statsRow}>
                <View style={styles.stat}>
                  <Text style={styles.statNumber}>24/7</Text>
                  <Text style={styles.statLabel}>
                    AVAILABLE
                  </Text>
                </View>

                <View style={styles.stat}>
                  <Text style={styles.statNumber}>100%</Text>
                  <Text style={styles.statLabel}>
                    LOCAL
                  </Text>
                </View>

                <View style={styles.stat}>
                  <Text style={styles.statNumber}>₹</Text>
                  <Text style={styles.statLabel}>
                    FAIR FARES
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* ================= FEATURES ================= */}

          <View style={styles.features}>
            <Text style={styles.sectionSmall}>
              WHY RISHIRIDES?
            </Text>

            <Text style={styles.sectionTitle}>
              Built for everyone on the road.
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
                text="Find convenient rides and travel comfortably around Rishikesh."
              />

              <FeatureCard
                icon="steering"
                title="For Drivers"
                text="Drive when you want and earn from rides around the city."
              />

              <FeatureCard
                icon="shield-check"
                title="Safe & Reliable"
                text="A trusted platform designed for safer local transportation."
              />
            </View>
          </View>

          {/* ================= FOOTER ================= */}

          <View style={styles.footer}>
            <Text style={styles.footerLogo}>
              RISHIRIDES
            </Text>

            <Text style={styles.footerText}>
              Ride smart. Drive smart. Ride RishiRides.
            </Text>

            <Text style={styles.copyright}>
              © 2026 RishiRides. Made for Rishikesh.
            </Text>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

/* ================= TRUST ITEM ================= */

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
        size={20}
        color="#fff"
      />

      <Text style={styles.trustText}>
        {text}
      </Text>
    </View>
  );
}

/* ================= FEATURE CARD ================= */

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
      <View style={styles.featureIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={27}
          color="#fff"
        />
      </View>

      <Text style={styles.featureTitle}>
        {title}
      </Text>

      <Text style={styles.featureText}>
        {text}
      </Text>
    </View>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
  },

  background: {
    flex: 1,
  },

overlay: {
  ...StyleSheet.absoluteFill,
  backgroundColor: 'rgba(0,0,0,0.55)',
},


  header: {
    width: '92%',
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
  },

  headerDesktop: {
    width: '88%',
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logoCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#18a565',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  logoRishi: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },

  logoRides: {
    color: '#20c478',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },

  nav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 32,
  },

  navActive: {
    color: '#20c478',
    fontSize: 12,
    fontWeight: '900',
  },

  navText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
  },

  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  loginButton: {
    paddingHorizontal: 17,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.6)',
  },

  loginText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

  signupButton: {
    backgroundColor: '#18a565',
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 8,
  },

  signupText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '800',
  },

  hero: {
    width: '92%',
    alignSelf: 'center',
    paddingTop: 50,
    paddingBottom: 55,
  },

  heroDesktop: {
    width: '88%',
    minHeight: 570,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  heroLeft: {
    width: '100%',
  },

  heroLeftDesktop: {
    width: '55%',
  },

  locationBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#18a565',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 18,
  },

  locationText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 6,
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#fff',
    fontSize: 47,
    fontWeight: '900',
    lineHeight: 53,
  },

  heroHighlight: {
    color: '#20c478',
    fontSize: 52,
    fontWeight: '900',
    lineHeight: 59,
  },

  heroDescription: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 15,
    lineHeight: 24,
    marginTop: 17,
    maxWidth: 570,
  },

  roleButtons: {
    marginTop: 28,
    gap: 12,
    maxWidth: 570,
  },

  roleButton: {
    minHeight: 70,
    borderRadius: 13,
    backgroundColor: '#18a565',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  driverRoleButton: {
    minHeight: 70,
    borderRadius: 13,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  roleIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  driverIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#e8f7f0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  roleContent: {
    flex: 1,
    marginLeft: 12,
  },

  roleTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },

  roleDescription: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 11,
    marginTop: 4,
  },

  driverRoleTitle: {
    color: '#222',
    fontSize: 13,
    fontWeight: '900',
  },

  driverRoleDescription: {
    color: '#888',
    fontSize: 11,
    marginTop: 4,
  },

  trustRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 18,
    marginTop: 29,
  },

  trustItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  trustText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },

  /* RIGHT */

  rightSection: {
    width: '100%',
    alignItems: 'center',
    marginTop: 50,
  },

  rightSectionDesktop: {
    width: '38%',
    marginTop: 0,
  },

  illustrationCircle: {
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: 'rgba(255,255,255,0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },

  rightTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 25,
  },

  rightHighlight: {
    color: '#20c478',
    fontSize: 35,
    fontWeight: '900',
    marginTop: 2,
  },

  rightDescription: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 6,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 25,
    gap: 12,
  },

  stat: {
    minWidth: 78,
    alignItems: 'center',
    padding: 11,
    borderRadius: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  statNumber: {
    color: '#20c478',
    fontSize: 18,
    fontWeight: '900',
  },

  statLabel: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 3,
  },

  /* FEATURES */

  features: {
    width: '92%',
    alignSelf: 'center',
    paddingVertical: 35,
  },

  sectionSmall: {
    color: '#20c478',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  sectionTitle: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 27,
    fontWeight: '900',
    marginTop: 7,
    marginBottom: 25,
  },

  featureRow: {
    flexDirection: 'row',
    gap: 14,
  },

  featureColumn: {
    flexDirection: 'column',
  },

  featureCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },

  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#18a565',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  featureTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 7,
  },

  featureText: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 12,
    lineHeight: 18,
  },

  /* FOOTER */

  footer: {
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 25,
  },

  footerLogo: {
    color: '#20c478',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 2,
  },

  footerText: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 11,
    marginTop: 8,
  },

  copyright: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 9,
    marginTop: 13,
  },
});
