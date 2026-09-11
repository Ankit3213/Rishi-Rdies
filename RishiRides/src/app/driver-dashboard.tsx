import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function DriverDashboard() {
  const router = useRouter();

  const [isOnline, setIsOnline] = useState(true);
  const [rideRequest, setRideRequest] = useState(true);

  const handleToggleOnline = () => {
    setIsOnline(!isOnline);
  };

  const handleAcceptRide = () => {
    setRideRequest(false);

    Alert.alert(
      'Ride Accepted',
      'You have accepted the passenger ride request.'
    );
  };

  const handleDeclineRide = () => {
    setRideRequest(false);

    Alert.alert(
      'Ride Declined',
      'The ride request has been declined.'
    );
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: () => router.replace('/landing'),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.smallText}>WELCOME BACK</Text>
            <Text style={styles.driverName}>Driver 👋</Text>
          </View>

          <Pressable
            style={styles.profileButton}
            onPress={() =>
              Alert.alert('Profile', 'Driver profile will be available here.')
            }
          >
            <MaterialCommunityIcons
              name="account"
              size={28}
              color="#ffffff"
            />
          </Pressable>
        </View>

        {/* ONLINE STATUS */}
        <View style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <View
              style={[
                styles.statusDot,
                {
                  backgroundColor: isOnline ? '#22c55e' : '#ef4444',
                },
              ]}
            />

            <View>
              <Text style={styles.statusTitle}>
                {isOnline ? 'You are Online' : 'You are Offline'}
              </Text>

              <Text style={styles.statusSubtitle}>
                {isOnline
                  ? 'You can receive new ride requests'
                  : 'You will not receive ride requests'}
              </Text>
            </View>
          </View>

          <Pressable
            style={[
              styles.toggle,
              {
                backgroundColor: isOnline ? '#16a34a' : '#d1d5db',
              },
            ]}
            onPress={handleToggleOnline}
          >
            <View
              style={[
                styles.toggleCircle,
                {
                  alignSelf: isOnline ? 'flex-end' : 'flex-start',
                },
              ]}
            />
          </Pressable>
        </View>

        {/* STATS */}
        <Text style={styles.sectionTitle}>Today's Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="cash"
                size={24}
                color="#16a34a"
              />
            </View>

            <Text style={styles.statValue}>₹1,250</Text>
            <Text style={styles.statLabel}>Earnings</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="car"
                size={24}
                color="#2563eb"
              />
            </View>

            <Text style={styles.statValue}>8</Text>
            <Text style={styles.statLabel}>Rides</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons
                name="star"
                size={24}
                color="#f59e0b"
              />
            </View>

            <Text style={styles.statValue}>4.9</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* RIDE REQUEST */}
        {isOnline && rideRequest && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>New Ride Request</Text>

              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>NEW</Text>
              </View>
            </View>

            <View style={styles.rideCard}>
              <View style={styles.passengerHeader}>
                <View style={styles.passengerAvatar}>
                  <MaterialCommunityIcons
                    name="account"
                    size={28}
                    color="#2563eb"
                  />
                </View>

                <View style={styles.passengerInfo}>
                  <Text style={styles.passengerName}>
                    Passenger
                  </Text>

                  <View style={styles.ratingRow}>
                    <MaterialCommunityIcons
                      name="star"
                      size={16}
                      color="#f59e0b"
                    />

                    <Text style={styles.ratingText}>4.8</Text>
                  </View>
                </View>

                <View style={styles.fareContainer}>
                  <Text style={styles.fare}>₹180</Text>
                  <Text style={styles.fareLabel}>Estimated fare</Text>
                </View>
              </View>

              {/* PICKUP */}
              <View style={styles.locationRow}>
                <View style={styles.locationIcon}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#16a34a"
                  />
                </View>

                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>PICKUP</Text>
                  <Text style={styles.locationText}>
                    Tapovan, Rishikesh
                  </Text>
                </View>
              </View>

              <View style={styles.locationLine} />

              {/* DESTINATION */}
              <View style={styles.locationRow}>
                <View style={styles.locationIcon}>
                  <MaterialCommunityIcons
                    name="map-marker"
                    size={20}
                    color="#ef4444"
                  />
                </View>

                <View style={styles.locationTextContainer}>
                  <Text style={styles.locationLabel}>DESTINATION</Text>
                  <Text style={styles.locationText}>
                    Ram Jhula, Rishikesh
                  </Text>
                </View>
              </View>

              {/* DISTANCE */}
              <View style={styles.rideInfoRow}>
                <View style={styles.rideInfo}>
                  <MaterialCommunityIcons
                    name="map-marker-distance"
                    size={20}
                    color="#64748b"
                  />

                  <Text style={styles.rideInfoText}>
                    4.2 km
                  </Text>
                </View>

                <View style={styles.rideInfo}>
                  <MaterialCommunityIcons
                    name="clock-outline"
                    size={20}
                    color="#64748b"
                  />

                  <Text style={styles.rideInfoText}>
                    15 min
                  </Text>
                </View>
              </View>

              {/* BUTTONS */}
              <View style={styles.actionRow}>
                <Pressable
                  style={styles.declineButton}
                  onPress={handleDeclineRide}
                >
                  <MaterialCommunityIcons
                    name="close"
                    size={21}
                    color="#ef4444"
                  />

                  <Text style={styles.declineText}>
                    Decline
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.acceptButton}
                  onPress={handleAcceptRide}
                >
                  <MaterialCommunityIcons
                    name="check"
                    size={21}
                    color="#ffffff"
                  />

                  <Text style={styles.acceptText}>
                    Accept Ride
                  </Text>
                </Pressable>
              </View>
            </View>
          </>
        )}

        {/* OFFLINE MESSAGE */}
        {!isOnline && (
          <View style={styles.offlineCard}>
            <MaterialCommunityIcons
              name="power"
              size={45}
              color="#94a3b8"
            />

            <Text style={styles.offlineTitle}>
              You are offline
            </Text>

            <Text style={styles.offlineText}>
              Turn on your online status to start receiving
              passenger ride requests.
            </Text>

            <Pressable
              style={styles.goOnlineButton}
              onPress={handleToggleOnline}
            >
              <Text style={styles.goOnlineText}>
                GO ONLINE
              </Text>
            </Pressable>
          </View>
        )}

        {/* QUICK ACTIONS */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.quickActions}>
          <Pressable
            style={styles.quickAction}
            onPress={() =>
              Alert.alert(
                'Ride History',
                'Your completed rides will appear here.'
              )
            }
          >
            <View style={styles.quickIcon}>
              <MaterialCommunityIcons
                name="history"
                size={25}
                color="#2563eb"
              />
            </View>

            <Text style={styles.quickTitle}>Ride History</Text>
            <Text style={styles.quickSubtitle}>
              View your rides
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickAction}
            onPress={() =>
              Alert.alert(
                'Earnings',
                'Your earnings details will appear here.'
              )
            }
          >
            <View style={styles.quickIcon}>
              <MaterialCommunityIcons
                name="wallet"
                size={25}
                color="#16a34a"
              />
            </View>

            <Text style={styles.quickTitle}>Earnings</Text>
            <Text style={styles.quickSubtitle}>
              View your earnings
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickAction}
            onPress={() =>
              Alert.alert(
                'Profile',
                'Your driver profile will appear here.'
              )
            }
          >
            <View style={styles.quickIcon}>
              <MaterialCommunityIcons
                name="account"
                size={25}
                color="#9333ea"
              />
            </View>

            <Text style={styles.quickTitle}>My Profile</Text>
            <Text style={styles.quickSubtitle}>
              Manage profile
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickAction}
            onPress={() =>
              Alert.alert(
                'Support',
                'Driver support will be available here.'
              )
            }
          >
            <View style={styles.quickIcon}>
              <MaterialCommunityIcons
                name="help-circle"
                size={25}
                color="#f59e0b"
              />
            </View>

            <Text style={styles.quickTitle}>Help & Support</Text>
            <Text style={styles.quickSubtitle}>
              Get assistance
            </Text>
          </Pressable>
        </View>

        {/* ACTIVE RIDE */}
        <Text style={styles.sectionTitle}>Active Ride</Text>

        <View style={styles.noRideCard}>
          <View style={styles.noRideIcon}>
            <MaterialCommunityIcons
              name="car-clock"
              size={35}
              color="#94a3b8"
            />
          </View>

          <View style={styles.noRideContent}>
            <Text style={styles.noRideTitle}>
              No active ride
            </Text>

            <Text style={styles.noRideText}>
              Accepted rides will appear here.
            </Text>
          </View>
        </View>

        {/* LOGOUT */}
        <Pressable
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <MaterialCommunityIcons
            name="logout"
            size={21}
            color="#ef4444"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          RishiRides • Driver App
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  container: {
    flex: 1,
  },

  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },

  smallText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: 1,
  },

  driverName: {
    fontSize: 28,
    fontWeight: '800',
    color: '#0f172a',
    marginTop: 3,
  },

  profileButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#16a34a',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statusCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  statusLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },

  statusTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  statusSubtitle: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
  },

  toggle: {
    width: 54,
    height: 30,
    borderRadius: 15,
    padding: 3,
    justifyContent: 'center',
  },

  toggleCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ffffff',
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 12,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 28,
  },

  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 13,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  statValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0f172a',
  },

  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 3,
  },

  newBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 12,
  },

  newBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#15803d',
  },

  rideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 28,
  },

  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },

  passengerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#dbeafe',
    justifyContent: 'center',
    alignItems: 'center',
  },

  passengerInfo: {
    flex: 1,
    marginLeft: 12,
  },

  passengerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },

  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },

  ratingText: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 4,
  },

  fareContainer: {
    alignItems: 'flex-end',
  },

  fare: {
    fontSize: 22,
    fontWeight: '800',
    color: '#16a34a',
  },

  fareLabel: {
    fontSize: 10,
    color: '#64748b',
    marginTop: 2,
  },

  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  locationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  locationTextContainer: {
    marginLeft: 12,
    flex: 1,
  },

  locationLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#94a3b8',
    letterSpacing: 0.8,
  },

  locationText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0f172a',
    marginTop: 3,
  },

  locationLine: {
    width: 1,
    height: 18,
    backgroundColor: '#cbd5e1',
    marginLeft: 20,
  },

  rideInfoRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 18,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },

  rideInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  rideInfoText: {
    fontSize: 13,
    color: '#475569',
    marginLeft: 6,
  },

  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 18,
  },

  declineButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  declineText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },

  acceptButton: {
    flex: 1.5,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#16a34a',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  acceptText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 6,
  },

  offlineCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 28,
  },

  offlineTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#334155',
    marginTop: 12,
  },

  offlineText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 8,
    maxWidth: 300,
  },

  goOnlineButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 18,
  },

  goOnlineText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '800',
  },

  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 28,
  },

  quickAction: {
    width: '48%',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },

  quickIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },

  quickTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0f172a',
  },

  quickSubtitle: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 3,
  },

  noRideCard: {
    backgroundColor: '#ffffff',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 25,
  },

  noRideIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  noRideContent: {
    marginLeft: 14,
  },

  noRideTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#334155',
  },

  noRideText: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },

  logoutButton: {
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  logoutText: {
    color: '#ef4444',
    fontSize: 14,
    fontWeight: '700',
    marginLeft: 8,
  },

  footer: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 25,
  },
});