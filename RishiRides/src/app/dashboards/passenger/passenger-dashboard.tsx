import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
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
import { vehicleForPassengerCount } from '../../../domain/ride-rules';

const bookingConfigured = Boolean(process.env.EXPO_PUBLIC_API_URL);

const destinations = [
  'Triveni Ghat',
  'Laxman Jhula',
  'Beatles Ashram',
  'Ram Jhula',
  'Parmarth Niketan',
  'Neer Garh Waterfall',
  'Gita Bhawan',
  'Shivpuri',
];

export default function PassengerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const desktop = width >= 900;
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [riderMobile, setRiderMobile] = useState('');
  const [authReady, setAuthReady] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [pickupCoordinates, setPickupCoordinates] = useState<Location.LocationObjectCoords | null>(null);
  const [passengerCount, setPassengerCount] = useState(1);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationMessage, setLocationMessage] = useState('');
  const [bookingMessage, setBookingMessage] = useState('');

  const vehicle = useMemo(() => vehicleForPassengerCount(passengerCount), [passengerCount]);

  useEffect(() => {
    let active = true;
    AsyncStorage.multiGet(['isLoggedIn', 'userRole', 'userMobile'])
      .then((entries) => {
        if (!active) return;
        const values = Object.fromEntries(entries);
        if (values.isLoggedIn !== 'true' || values.userRole !== 'passenger') {
          router.replace({ pathname: '/login', params: { role: 'passenger', flow: 'booking' } });
          return;
        }
        setRiderMobile(values.userMobile ?? '');
        setAuthReady(true);
      })
      .catch(() => {
        if (active) {
          setBookingMessage('Could not verify your saved sign-in. Please sign in again.');
          router.replace({ pathname: '/login', params: { role: 'passenger', flow: 'booking' } });
        }
      });

    return () => {
      active = false;
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['isLoggedIn', 'userRole', 'userMobile', 'authToken']);
      router.replace('/landing');
    } catch {
      setBookingMessage('Could not safely sign out. Please try again.');
    }
  };

  const useCurrentLocation = async () => {
    setLocationLoading(true);
    setLocationMessage('');
    try {
      const permission = await Location.requestForegroundPermissionsAsync();
      if (!permission.granted) {
        setLocationMessage('Location permission was denied. Enter a pickup point manually to continue.');
        setPickupCoordinates(null);
        return;
      }

      const current = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      const [address] = await Location.reverseGeocodeAsync(current.coords);
      const name = address
        ? [address.name, address.street, address.district, address.city]
            .filter((part, index, parts) => part && parts.indexOf(part) === index)
            .join(', ')
        : '';

      setPickupCoordinates(current.coords);
      if (name) {
        setPickup(name);
        setLocationMessage('Pickup set from your device location.');
      } else {
        setPickup('');
        setLocationMessage('Location name unavailable. Enter a pickup point manually before booking.');
      }
    } catch {
      setPickupCoordinates(null);
      setLocationMessage('Could not determine your location. Enter a pickup point manually or retry.');
    } finally {
      setLocationLoading(false);
    }
  };

  const submitBooking = () => {
    if (!pickup.trim()) {
      setBookingMessage('Enter or select a pickup point before requesting a ride.');
      return;
    }
    if (!destination.trim()) {
      setBookingMessage('Choose or enter your destination.');
      return;
    }
    if (!bookingConfigured) {
      setBookingMessage('Booking service unavailable. Your request has not been sent.');
      return;
    }
    setBookingMessage('The configured API does not provide route estimation or ride requests yet.');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scroll, styles.contentWidth]}>
        <View style={styles.header}>
          <View style={styles.brand}>
            <View style={styles.logoMark}>
              <MaterialCommunityIcons name="rickshaw" size={24} color={colors.green} />
            </View>
            <View>
              <Text style={styles.brandName}>RishiRide</Text>
              <Text style={styles.brandLocation}>Ride Local. Go Far.</Text>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={profileOpen ? 'Close profile menu' : 'Open profile menu'}
            accessibilityState={{ expanded: profileOpen }}
            style={styles.profileButton}
            onPress={() => setProfileOpen((open) => !open)}
          >
            <MaterialCommunityIcons name="account-outline" size={22} color={colors.text} />
          </Pressable>
        </View>

        {profileOpen && (
          <View style={styles.profileMenu}>
            <View style={styles.profileSummary}>
              <View style={styles.profileAvatar}>
                <MaterialCommunityIcons name="account" size={20} color={colors.green} />
              </View>
              <View style={styles.profileDetails}>
                <Text style={styles.profileName}>Passenger account</Text>
                <Text style={styles.profileMobile}>{riderMobile}</Text>
              </View>
            </View>
            <Pressable accessibilityRole="button" style={styles.logoutButton} onPress={handleLogout}>
              <MaterialCommunityIcons name="logout" size={17} color="#B7463C" />
              <Text style={styles.logoutText}>Sign out</Text>
            </Pressable>
          </View>
        )}

        <View style={[styles.heroSection, desktop && styles.heroSectionDesktop]}>
          <View style={[styles.heroCopy, desktop && styles.heroCopyDesktop]}>
            <View style={styles.eyebrowRow}>
              <View style={styles.liveDot} />
              <Text style={styles.eyebrow}>LOCAL RIDES, MADE SIMPLE</Text>
            </View>
            <Text style={styles.title}>Good Morning,</Text>
            <Text style={styles.greetingName}>Rider!</Text>
            <Text style={styles.subtitle}>Where would you like to go today?</Text>

            <View style={styles.bookingPanel}>
          <View style={styles.fieldRow}>
            <View style={styles.routeDots}>
              <View style={styles.pickupDot} />
              <View style={styles.routeLine} />
              <View style={styles.destinationDot} />
            </View>
            <View style={styles.fields}>
              <Text style={styles.label}>PICKUP</Text>
              <TextInput
                accessibilityLabel="Pickup location"
                style={styles.input}
                value={pickup}
                onChangeText={(value) => {
                  setPickup(value);
                  setPickupCoordinates(null);
                  setBookingMessage('');
                }}
                placeholder="Enter a pickup point"
                placeholderTextColor={colors.muted}
                returnKeyType="next"
              />
              <View style={styles.fieldDivider} />
              <Text style={styles.label}>DESTINATION</Text>
              <TextInput
                accessibilityLabel="Destination"
                style={styles.input}
                value={destination}
                onChangeText={(value) => {
                  setDestination(value);
                  setBookingMessage('');
                }}
                placeholder="Where are you headed?"
                placeholderTextColor={colors.muted}
                returnKeyType="done"
              />
            </View>
          </View>

          <Pressable accessibilityRole="button" style={[styles.gpsButton, locationLoading && styles.disabled]} onPress={useCurrentLocation} disabled={locationLoading}>
            <MaterialCommunityIcons name="crosshairs-gps" size={19} color={colors.green} />
            <Text style={styles.gpsText}>{locationLoading ? 'Finding your location…' : 'Use my current location'}</Text>
          </Pressable>
          {!!locationMessage && <Text accessibilityLiveRegion="polite" style={styles.noticeText}>{locationMessage}</Text>}

          <View style={styles.passengerBar}>
            <View>
              <Text style={styles.label}>PASSENGERS</Text>
              <Text style={styles.passengerHint}>Choose the group size</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable accessibilityRole="button" accessibilityLabel="Remove one passenger" style={styles.stepButton} onPress={() => setPassengerCount((count) => Math.max(1, count - 1))}>
                <MaterialCommunityIcons name="minus" size={18} color={colors.text} />
              </Pressable>
              <Text style={styles.count}>{passengerCount}</Text>
              <Pressable accessibilityRole="button" accessibilityLabel="Add one passenger" style={styles.stepButton} onPress={() => setPassengerCount((count) => Math.min(6, count + 1))}>
                <MaterialCommunityIcons name="plus" size={18} color={colors.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.vehicleStrip}>
            <MaterialCommunityIcons name="rickshaw" size={20} color={colors.green} />
            <Text style={styles.vehicleText}>{vehicle}</Text>
            <Text style={styles.capacityText}>{passengerCount <= 3 ? 'UP TO 3' : '4+ PASSENGERS'}</Text>
          </View>

          <Pressable accessibilityRole="button" style={styles.bookButton} onPress={submitBooking}>
            <Text style={styles.bookButtonText}>Book Ride</Text>
            <MaterialCommunityIcons name="arrow-right" size={20} color="#FFFFFF" />
          </Pressable>
          {!!bookingMessage && <Text accessibilityRole="alert" style={styles.bookingError}>{bookingMessage}</Text>}
            </View>
          </View>

          <View style={[styles.heroArtwork, !desktop && styles.heroArtworkMobile]}>
            <LinearGradient
              colors={['#DCEFFC', '#EAF8F0', '#F6F5E9']}
              style={StyleSheet.absoluteFill}
            />
            <View style={styles.artSun} />
            <View style={styles.artMountainBack} />
            <View style={styles.artMountainFront} />
            <View style={styles.artRiver} />
            <View style={styles.artRoad} />
            <Text style={styles.artCaption}>Rishikesh{'\n'}Awaits!</Text>
            <MaterialCommunityIcons name="rickshaw" size={desktop ? 190 : 155} color={colors.green} style={styles.artRickshaw} />
          </View>
        </View>

        <View style={styles.serviceNote}>
          <MaterialCommunityIcons name="information-outline" size={19} color={colors.green} />
          <Text style={styles.serviceNoteText}>
            {bookingConfigured
              ? 'Route estimates and ride dispatch are not available from the configured service yet.'
              : 'Secure booking, route estimates, and driver matching are not configured. No ride request will be sent.'}
          </Text>
        </View>

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionKicker}>A FEW PLACES TO START</Text>
            <Text style={styles.sectionTitle}>Around Rishikesh</Text>
          </View>
          <MaterialCommunityIcons name="map-outline" size={22} color={colors.green} />
        </View>
        <View style={styles.destinationGrid}>
          {destinations.map((place, index) => (
            <Pressable key={place} accessibilityRole="button" style={styles.destination} onPress={() => setDestination(place)}>
              <LinearGradient
                colors={destinationColors[index % destinationColors.length]}
                style={styles.destinationArt}
              >
                <MaterialCommunityIcons name={destinationIcons[index % destinationIcons.length]} size={28} color="#FFFFFF" />
                <Text style={styles.destinationNumber}>{String(index + 1).padStart(2, '0')}</Text>
              </LinearGradient>
              <View style={styles.destinationCaption}>
                <Text style={styles.destinationName}>{place}</Text>
                <MaterialCommunityIcons name="arrow-top-right" size={15} color={colors.green} />
              </View>
            </Pressable>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>Rishi<Text style={styles.footerAccent}>Ride</Text></Text>
          <View style={styles.footerLinks}>
            <Pressable accessibilityRole="button" onPress={() => router.push('/landing')}>
              <Text style={styles.footerLink}>Home</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.push('/about')}>
              <Text style={styles.footerLink}>About</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => router.push('/contact')}>
              <Text style={styles.footerLink}>Contact</Text>
            </Pressable>
          </View>
          <Text style={styles.footerCopyright}>© 2026 RishiRide · Rishikesh</Text>
        </View>
        {pickupCoordinates && <Text style={styles.locationPrivacy}>Your device provided a pickup location; coordinates are not displayed.</Text>}
      </ScrollView>
    </View>
  );
}

const destinationColors = [
  ['#82B9A6', '#1A7058'],
  ['#8BB5C5', '#357F91'],
  ['#A6B884', '#607A49'],
  ['#D7AE76', '#A66F3D'],
] as const;

const destinationIcons: (keyof typeof MaterialCommunityIcons.glyphMap)[] = [
  'temple-buddhist',
  'bridge',
  'water',
  'pine-tree',
];

const colors = {
  ink: '#15323A',
  background: '#FFFFFF',
  panel: '#FFFFFF',
  panelRaised: '#E8F5EB',
  line: '#E2ECE6',
  text: '#1C333B',
  muted: '#73858A',
  mint: '#C8F3D8',
  green: '#078653',
  amber: '#8B6B31',
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  scroll: { width: '100%', maxWidth: 680, alignSelf: 'center', paddingHorizontal: 20, paddingBottom: 34 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 17 },
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoMark: { width: 42, height: 42, borderRadius: 12, backgroundColor: colors.mint, alignItems: 'center', justifyContent: 'center' },
  brandName: { color: colors.text, fontSize: 17, fontWeight: '900' },
  brandLocation: { color: colors.muted, fontSize: 9, fontWeight: '800', marginTop: 2 },
  profileButton: { width: 42, height: 42, borderWidth: 1, borderColor: colors.line, borderRadius: 21, alignItems: 'center', justifyContent: 'center' },
  eyebrowRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 20 },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.mint },
  eyebrow: { color: colors.mint, fontSize: 10, fontWeight: '900', letterSpacing: 1.1 },
  title: { color: colors.text, fontSize: 34, fontWeight: '900', marginTop: 10 },
  subtitle: { color: colors.muted, fontSize: 14, marginTop: 4, marginBottom: 23 },
  bookingPanel: { backgroundColor: colors.panel, borderRadius: 14, borderWidth: 1, borderColor: colors.line, padding: 17 },
  fieldRow: { flexDirection: 'row', gap: 13 },
  routeDots: { width: 14, alignItems: 'center', paddingTop: 27, paddingBottom: 21 },
  pickupDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.mint },
  routeLine: { width: 1, flex: 1, minHeight: 35, backgroundColor: '#516566', marginVertical: 6 },
  destinationDot: { width: 10, height: 10, backgroundColor: colors.amber },
  fields: { flex: 1 },
  label: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  input: { color: colors.text, fontSize: 15, fontWeight: '700', paddingVertical: 9, minHeight: 42 },
  fieldDivider: { height: 1, backgroundColor: colors.line, marginVertical: 9 },
  gpsButton: { minHeight: 42, flexDirection: 'row', alignItems: 'center', gap: 9, borderTopWidth: 1, borderTopColor: colors.line, marginTop: 8, paddingTop: 12 },
  disabled: { opacity: 0.55 },
  gpsText: { color: colors.mint, fontSize: 13, fontWeight: '800' },
  noticeText: { color: colors.amber, fontSize: 12, lineHeight: 17, marginTop: 7 },
  passengerBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: colors.line, marginTop: 13, paddingTop: 14 },
  passengerHint: { color: colors.text, fontSize: 13, fontWeight: '700', marginTop: 4 },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: colors.panelRaised, alignItems: 'center', justifyContent: 'center' },
  count: { color: colors.text, fontSize: 16, fontWeight: '900', minWidth: 17, textAlign: 'center' },
  vehicleStrip: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.panelRaised, borderRadius: 8, paddingHorizontal: 11, paddingVertical: 10, marginTop: 16 },
  vehicleText: { color: colors.text, fontSize: 13, fontWeight: '800', flex: 1 },
  capacityText: { color: colors.muted, fontSize: 9, fontWeight: '900' },
  bookButton: { height: 52, backgroundColor: colors.mint, borderRadius: 9, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 14 },
  bookButtonText: { color: colors.ink, fontSize: 14, fontWeight: '900' },
  bookingError: { color: colors.amber, fontSize: 12, lineHeight: 17, marginTop: 10 },
  serviceNote: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, borderBottomWidth: 1, borderBottomColor: colors.line, paddingVertical: 15 },
  serviceNoteText: { color: colors.muted, fontSize: 12, lineHeight: 17, flex: 1 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 22, marginBottom: 12 },
  sectionKicker: { color: colors.muted, fontSize: 9, fontWeight: '900', letterSpacing: 1 },
  sectionTitle: { color: colors.text, fontSize: 21, fontWeight: '900', marginTop: 5 },
  destinationGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  destination: { width: '48%', minHeight: 58, flexGrow: 1, flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: colors.panel, borderBottomWidth: 1, borderBottomColor: colors.line, paddingHorizontal: 10 },
  destinationIndex: { width: 27, height: 27, borderRadius: 8, backgroundColor: colors.panelRaised, alignItems: 'center', justifyContent: 'center' },
  destinationNumber: { color: colors.mint, fontSize: 9, fontWeight: '900' },
  destinationName: { color: colors.text, fontSize: 12, fontWeight: '700', flex: 1 },
  footerNav: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: colors.line, marginTop: 25, paddingTop: 14 },
  navItem: { minWidth: 74, alignItems: 'center', gap: 5, padding: 5 },
  navText: { color: colors.muted, fontSize: 10, fontWeight: '800' },
  navTextActive: { color: colors.mint },
  footerBrand: { color: '#6d8382', fontSize: 9, fontWeight: '900', letterSpacing: 1.4, textAlign: 'center', marginTop: 17 },
  locationPrivacy: { color: colors.muted, fontSize: 10, textAlign: 'center', marginTop: 8 },
});