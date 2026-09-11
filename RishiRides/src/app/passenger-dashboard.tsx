import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PassengerDashboard() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        {/* HEADER */}

        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>
              WELCOME TO
            </Text>

            <Text style={styles.logo}>
              RISHIRIDES
            </Text>
          </View>

          <Pressable style={styles.profileButton}>
            <MaterialCommunityIcons
              name="account"
              size={23}
              color="#fff"
            />
          </Pressable>
        </View>

        {/* GREETING */}

        <Text style={styles.greeting}>
          Where are you going?
        </Text>

        <Text style={styles.subtitle}>
          Book a comfortable ride around Rishikesh.
        </Text>

        {/* LOCATION CARD */}

        <View style={styles.locationCard}>
          <View style={styles.locationRow}>
            <View style={styles.greenDot} />

            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>
                PICKUP
              </Text>

              <Text style={styles.locationText}>
                Current location
              </Text>
            </View>

            <MaterialCommunityIcons
              name="crosshairs-gps"
              size={23}
              color="#18a565"
            />
          </View>

          <View style={styles.line} />

          <View style={styles.locationRow}>
            <View style={styles.redDot} />

            <View style={styles.locationContent}>
              <Text style={styles.locationLabel}>
                DESTINATION
              </Text>

              <Text style={styles.locationTextPlaceholder}>
                Where do you want to go?
              </Text>
            </View>

            <MaterialCommunityIcons
              name="map-marker"
              size={23}
              color="#e74c3c"
            />
          </View>

          <Pressable style={styles.searchButton}>
            <MaterialCommunityIcons
              name="magnify"
              size={21}
              color="#fff"
            />

            <Text style={styles.searchText}>
              FIND A RIDE
            </Text>
          </Pressable>
        </View>

        {/* QUICK DESTINATIONS */}

        <Text style={styles.sectionTitle}>
          Popular places
        </Text>

        <View style={styles.destinationGrid}>
          <Destination
            icon="temple-hindu"
            name="Ram Jhula"
          />

          <Destination
            icon="bridge"
            name="Laxman Jhula"
          />

          <Destination
            icon="waves"
            name="Ganga Ghat"
          />

          <Destination
            icon="flower"
            name="Parmarth Niketan"
          />
        </View>

        {/* RECENT */}

        <Text style={styles.sectionTitle}>
          Recent rides
        </Text>

        <View style={styles.emptyCard}>
          <View style={styles.emptyIcon}>
            <MaterialCommunityIcons
              name="car-outline"
              size={28}
              color="#18a565"
            />
          </View>

          <Text style={styles.emptyTitle}>
            No rides yet
          </Text>

          <Text style={styles.emptyText}>
            Your completed rides will appear here.
          </Text>
        </View>

        {/* BACK */}

        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <MaterialCommunityIcons
            name="arrow-left"
            size={19}
            color="#18a565"
          />

          <Text style={styles.backText}>
            Back
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

/* DESTINATION */

function Destination({
  icon,
  name,
}: {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  name: string;
}) {
  return (
    <Pressable style={styles.destinationCard}>
      <View style={styles.destinationIcon}>
        <MaterialCommunityIcons
          name={icon}
          size={22}
          color="#18a565"
        />
      </View>

      <Text style={styles.destinationName}>
        {name}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7f6',
  },

  scroll: {
    width: '92%',
    maxWidth: 850,
    alignSelf: 'center',
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 18,
  },

  smallText: {
    color: '#888',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  logo: {
    color: '#18a565',
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1,
    marginTop: 2,
  },

  profileButton: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: '#18a565',
    alignItems: 'center',
    justifyContent: 'center',
  },

  greeting: {
    color: '#222',
    fontSize: 30,
    fontWeight: '900',
    marginTop: 20,
  },

  subtitle: {
    color: '#777',
    fontSize: 13,
    marginTop: 6,
    marginBottom: 25,
  },

  locationCard: {
    backgroundColor: '#fff',
    borderRadius: 17,
    padding: 20,
    elevation: 4,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  greenDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#18a565',
    marginRight: 13,
  },

  redDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#e74c3c',
    marginRight: 13,
  },

  locationContent: {
    flex: 1,
  },

  locationLabel: {
    color: '#888',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.7,
  },

  locationText: {
    color: '#222',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 3,
  },

  locationTextPlaceholder: {
    color: '#aaa',
    fontSize: 14,
    marginTop: 3,
  },

  line: {
    height: 28,
    borderLeftWidth: 1,
    borderLeftColor: '#ddd',
    marginLeft: 6,
  },

  searchButton: {
    height: 52,
    backgroundColor: '#18a565',
    borderRadius: 11,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },

  searchText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '900',
  },

  sectionTitle: {
    color: '#222',
    fontSize: 20,
    fontWeight: '900',
    marginTop: 30,
    marginBottom: 13,
  },

  destinationGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  destinationCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 13,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },

  destinationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e8f7f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  destinationName: {
    color: '#333',
    fontSize: 12,
    fontWeight: '800',
    flex: 1,
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },

  emptyIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#e8f7f0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  emptyTitle: {
    color: '#333',
    fontSize: 16,
    fontWeight: '900',
    marginTop: 12,
  },

  emptyText: {
    color: '#999',
    fontSize: 12,
    marginTop: 5,
    textAlign: 'center',
  },

  backButton: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
    gap: 5,
  },

  backText: {
    color: '#18a565',
    fontSize: 13,
    fontWeight: '800',
  },
});