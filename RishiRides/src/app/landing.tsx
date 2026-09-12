
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
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBY9Loz0X8m5SKOrILkb6wm6DH5nFBq7hex4Z0YNINvQ&s=10';

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
        {/* Soft calm background layer - no absoluteFillObject */}
        <View style={styles.softBackground}>
          <View style={styles.softGlow} />
        </View>

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
                  size={26}
                  color="#ffffff"
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
                  color="#315c4d"
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
                across Rishikesh with safe, peaceful and
                reliable transportation.
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
                      size={24}
                      color="#ffffff"
                    />
                  </View>

                  <View style={styles.roleContent}>
                    <Text style={styles.roleTitle}>
                      I NEED A RIDE
                    </Text>

                    <Text style={styles.roleDescription}>
                      Book a comfortable ride around Rishikesh
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={21}
                    color="#ffffff"
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
                      size={24}
                      color="#4d806d"
                    />
                  </View>

                  <View style={styles.roleContent}>
                    <Text style={styles.driverRoleTitle}>
                      I WANT TO DRIVE
                    </Text>

                    <Text style={styles.driverRoleDescription}>
                      Earn peacefully by driving with RishiRides
                    </Text>
                  </View>

                  <MaterialCommunityIcons
                    name="arrow-right"
                    size={21}
                    color="#4d806d"
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
                  size={100}
                  color="#4d806d"
                />
              </View>

              <Text style={styles.rightTitle}>
                MOVE AROUND
              </Text>

              <Text style={styles.rightHighlight}>
                RISHIKESH
              </Text>

              <Text style={styles.rightDescription}>
                One calm platform for passengers and drivers.
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
              A calmer way to travel.
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
                text="A trusted platform designed for peaceful and reliable local transportation."
              />
            </View>
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
        size={19}
        color="#ffffff"
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
          size={26}
          color="#ffffff"
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
    backgroundColor: '#365c4e',
  },

  background: {
    flex: 1,
  },

<<<<<<< HEAD
overlay: {
  ...StyleSheet.absoluteFill,
  backgroundColor: 'rgba(0,0,0,0.55)',
},
=======
  /*
   * No StyleSheet.absoluteFillObject here.
   * This is a normal layout layer.
   */
  softBackground: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(28, 55, 47, 0.42)',
  },
>>>>>>> 528b960 (remove unnesscary file)

  softGlow: {
    flex: 1,
    backgroundColor: 'rgba(232, 244, 238, 0.08)',
  },

  /* ================= HEADER ================= */

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
    backgroundColor: '#4d806d',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 9,
  },

  logoRishi: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },

  logoRides: {
    color: '#a9d6c3',
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
    color: '#b9e2d0',
    fontSize: 12,
    fontWeight: '900',
  },

  navText: {
    color: '#ffffff',
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
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
  },

  loginText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },

  signupButton: {
    backgroundColor: '#4d806d',
    paddingHorizontal: 17,
    paddingVertical: 11,
    borderRadius: 20,
  },

  signupText: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '800',
  },

  /* ================= HERO ================= */

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
    backgroundColor: '#dcece5',
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 18,
  },

  locationText: {
    color: '#315c4d',
    fontSize: 10,
    fontWeight: '900',
    marginLeft: 6,
    letterSpacing: 1,
  },

  heroTitle: {
    color: '#ffffff',
    fontSize: 47,
    fontWeight: '900',
    lineHeight: 53,
  },

  heroHighlight: {
    color: '#b5dfcc',
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

  /* ================= ROLE BUTTONS ================= */

  roleButtons: {
    marginTop: 28,
    gap: 12,
    maxWidth: 570,
  },

  roleButton: {
    minHeight: 70,
    borderRadius: 18,
    backgroundColor: '#4d806d',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  driverRoleButton: {
    minHeight: 70,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.94)',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  roleIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  driverIcon: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#e4f1eb',
    justifyContent: 'center',
    alignItems: 'center',
  },

  roleContent: {
    flex: 1,
    marginLeft: 12,
  },

  roleTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '900',
  },

  roleDescription: {
    color: 'rgba(255,255,255,0.78)',
    fontSize: 11,
    marginTop: 4,
  },

  driverRoleTitle: {
    color: '#29483d',
    fontSize: 13,
    fontWeight: '900',
  },

  driverRoleDescription: {
    color: '#789087',
    fontSize: 11,
    marginTop: 4,
  },

  /* ================= TRUST ================= */

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
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    marginLeft: 6,
  },

  /* ================= RIGHT ================= */

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
    backgroundColor: 'rgba(245,250,247,0.94)',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },

  rightTitle: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 25,
  },

  rightHighlight: {
    color: '#b5dfcc',
    fontSize: 35,
    fontWeight: '900',
    marginTop: 2,
  },

  rightDescription: {
    color: 'rgba(255,255,255,0.76)',
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
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.12)',
  },

  statNumber: {
    color: '#c2e5d5',
    fontSize: 18,
    fontWeight: '900',
  },

  statLabel: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 8,
    fontWeight: '800',
    marginTop: 3,
  },

  /* ================= FEATURES ================= */

  features: {
    width: '92%',
    alignSelf: 'center',
    paddingVertical: 35,
  },

  sectionSmall: {
    color: '#b5dfcc',
    textAlign: 'center',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.4,
  },

  sectionTitle: {
    color: '#ffffff',
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
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },

  featureIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#4d806d',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  featureTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900',
    marginBottom: 7,
  },

  featureText: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    lineHeight: 18,
  },

  /* ================= FOOTER ================= */

  footer: {
    width: '92%',
    alignSelf: 'center',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.15)',
    paddingTop: 25,
  },

  footerLogo: {
    color: '#b5dfcc',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 2,
  },

  footerText: {
    color: 'rgba(255,255,255,0.68)',
    fontSize: 11,
    marginTop: 8,
  },

  copyright: {
    color: 'rgba(255,255,255,0.42)',
    fontSize: 9,
    marginTop: 13,
  },
});
