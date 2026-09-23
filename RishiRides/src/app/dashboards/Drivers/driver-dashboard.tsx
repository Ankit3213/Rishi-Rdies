
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width } = Dimensions.get("window");

export default function DriverDashboard() {
  const router = useRouter();

  const [online, setOnline] = useState(true);
  const [activeTab, setActiveTab] = useState("Home");
  const [notifications, setNotifications] = useState(2);

  const [ridesToday, setRidesToday] = useState(8);
  const [earnings, setEarnings] = useState(850);

  const toggleOnline = () => {
    setOnline((previous) => {
      const newStatus = !previous;

      Alert.alert(
        newStatus ? "You're Online 🚗" : "You're Offline",
        newStatus
          ? "You can now receive new ride requests."
          : "You won't receive new ride requests."
      );

      return newStatus;
    });
  };

  const showComingSoon = (title: string) => {
    Alert.alert(title, `${title} feature is ready to connect with your backend.`);
  };

  const logout = () => {
    Alert.alert(
      "Logout",
      "Do you want to logout from Rishi Rides?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => router.replace("/login"),
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View>
            <View style={styles.smallHeaderRow}>
              <View style={styles.liveDot} />
              <Text style={styles.liveText}>DRIVER PORTAL</Text>
            </View>

            <Text style={styles.heading}>Good morning 👋</Text>
            <Text style={styles.driverName}>Driver</Text>
          </View>

          <TouchableOpacity
            style={styles.notificationButton}
            onPress={() => {
              setNotifications(0);
              Alert.alert(
                "Notifications",
                "You have no new notifications."
              );
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={24}
              color="#0F172A"
            />

            {notifications > 0 && (
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationBadgeText}>
                  {notifications}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ================= ONLINE STATUS ================= */}

        <View style={styles.statusContainer}>
          <View style={styles.statusGlow} />

          <View style={styles.statusTop}>
            <View style={styles.statusIdentity}>
              <View
                style={[
                  styles.carCircle,
                  online ? styles.carCircleOnline : styles.carCircleOffline,
                ]}
              >
                <Ionicons
                  name="car-sport"
                  size={27}
                  color="#FFFFFF"
                />
              </View>

              <View>
                <Text style={styles.statusLabel}>
                  DRIVER STATUS
                </Text>

                <Text style={styles.statusTitle}>
                  {online ? "You're Online" : "You're Offline"}
                </Text>
              </View>
            </View>

            <Switch
              value={online}
              onValueChange={toggleOnline}
              trackColor={{
                false: "#CBD5E1",
                true: "#60A5FA",
              }}
              thumbColor={online ? "#208AEF" : "#64748B"}
            />
          </View>

          <View style={styles.statusDivider} />

          <View style={styles.statusBottom}>
            <View style={styles.statusInfo}>
              <Ionicons
                name="radio-outline"
                size={17}
                color={online ? "#16A34A" : "#94A3B8"}
              />

              <Text style={styles.statusInfoText}>
                {online
                  ? "Ready to receive rides"
                  : "Go online to receive rides"}
              </Text>
            </View>

            <View
              style={[
                styles.statusPill,
                online
                  ? styles.statusPillOnline
                  : styles.statusPillOffline,
              ]}
            >
              <Text
                style={[
                  styles.statusPillText,
                  online
                    ? styles.statusPillTextOnline
                    : styles.statusPillTextOffline,
                ]}
              >
                {online ? "ACTIVE" : "OFFLINE"}
              </Text>
            </View>
          </View>
        </View>

        {/* ================= QUICK STATS ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Today's Performance</Text>

          <TouchableOpacity
            onPress={() => showComingSoon("Performance")}
          >
            <Text style={styles.viewText}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.largeStat}>
            <View style={styles.statTop}>
              <View style={styles.statIconBlue}>
                <Ionicons
                  name="wallet-outline"
                  size={22}
                  color="#208AEF"
                />
              </View>

              <View style={styles.increaseBadge}>
                <Ionicons
                  name="trending-up"
                  size={13}
                  color="#16A34A"
                />
                <Text style={styles.increaseText}>12%</Text>
              </View>
            </View>

            <Text style={styles.statNumber}>₹{earnings}</Text>
            <Text style={styles.statDescription}>
              Today's earnings
            </Text>
          </View>

          <View style={styles.smallStat}>
            <View style={styles.statIconGreen}>
              <Ionicons
                name="checkmark-circle-outline"
                size={22}
                color="#16A34A"
              />
            </View>

            <Text style={styles.smallStatNumber}>
              {ridesToday}
            </Text>

            <Text style={styles.smallStatDescription}>
              Rides
            </Text>
          </View>

          <View style={styles.smallStat}>
            <View style={styles.statIconOrange}>
              <Ionicons
                name="time-outline"
                size={22}
                color="#F59E0B"
              />
            </View>

            <Text style={styles.smallStatNumber}>6.4h</Text>

            <Text style={styles.smallStatDescription}>
              Online
            </Text>
          </View>
        </View>

        {/* ================= RIDE RADAR ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Ride Radar</Text>

          <View style={styles.liveBadge}>
            <View style={styles.liveSmallDot} />
            <Text style={styles.liveBadgeText}>LIVE</Text>
          </View>
        </View>

        <View style={styles.radarCard}>
          {/* Map-like background */}
          <View style={styles.mapBackground}>
            <View style={styles.mapLineOne} />
            <View style={styles.mapLineTwo} />
            <View style={styles.mapLineThree} />
            <View style={styles.mapLineFour} />

            <View style={styles.mapRoadOne} />
            <View style={styles.mapRoadTwo} />

            <View style={styles.locationPin}>
              <View style={styles.pinPulse} />
              <Ionicons
                name="navigate"
                size={20}
                color="#FFFFFF"
              />
            </View>

            <View style={styles.mapLabel}>
              <Ionicons
                name="location"
                size={13}
                color="#208AEF"
              />
              <Text style={styles.mapLabelText}>
                Rishikesh
              </Text>
            </View>
          </View>

          <View style={styles.radarBottom}>
            <View>
              <Text style={styles.radarTitle}>
                You're in a good zone
              </Text>

              <Text style={styles.radarSubtitle}>
                High ride activity nearby
              </Text>
            </View>

            <View style={styles.radarNumberContainer}>
              <Text style={styles.radarNumber}>07</Text>
              <Text style={styles.radarRequests}>
                requests
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.radarButton}
            onPress={() =>
              showComingSoon("Ride Radar")
            }
          >
            <Ionicons
              name="scan-outline"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.radarButtonText}>
              Scan for rides
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= ACTIVE RIDE ================= */}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Current Ride</Text>

          <TouchableOpacity
            onPress={() => showComingSoon("Ride History")}
          >
            <Text style={styles.viewText}>History</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.rideCard}>
          <View style={styles.rideTop}>
            <View style={styles.rideIcon}>
              <Ionicons
                name="person-outline"
                size={24}
                color="#208AEF"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.rideStatus}>
                WAITING FOR PASSENGER
              </Text>

              <Text style={styles.rideMainText}>
                No active ride
              </Text>
            </View>

            <View style={styles.rideStatusDot}>
              <View style={styles.rideGreenDot} />
            </View>
          </View>

          <View style={styles.routeContainer}>
            <View style={styles.routeLineContainer}>
              <View style={styles.routeCircleBlue} />
              <View style={styles.routeLine} />
              <View style={styles.routeCircleGray} />
            </View>

            <View style={styles.routeTexts}>
              <Text style={styles.routeSmall}>PICKUP</Text>
              <Text style={styles.routeText}>
                Waiting for request
              </Text>

              <View style={{ height: 20 }} />

              <Text style={styles.routeSmall}>DESTINATION</Text>
              <Text style={styles.routeTextMuted}>
                Will appear after booking
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.acceptButton,
              !online && styles.disabledButton,
            ]}
            disabled={!online}
            onPress={() =>
              showComingSoon("Ride Requests")
            }
          >
            <Ionicons
              name="flash"
              size={19}
              color="#FFFFFF"
            />

            <Text style={styles.acceptButtonText}>
              {online
                ? "Find Ride Request"
                : "Go Online First"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= QUICK ACTIONS ================= */}

        <Text style={styles.sectionTitle}>Quick Actions</Text>

        <View style={styles.actionGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              showComingSoon("Ride History")
            }
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: "#EFF6FF" },
              ]}
            >
              <Ionicons
                name="receipt-outline"
                size={25}
                color="#208AEF"
              />
            </View>

            <Text style={styles.actionTitle}>
              Ride History
            </Text>

            <Text style={styles.actionSubtitle}>
              Previous trips
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              showComingSoon("Earnings")
            }
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: "#ECFDF5" },
              ]}
            >
              <Ionicons
                name="cash-outline"
                size={25}
                color="#16A34A"
              />
            </View>

            <Text style={styles.actionTitle}>
              Earnings
            </Text>

            <Text style={styles.actionSubtitle}>
              Track your income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              showComingSoon("Vehicle")
            }
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: "#FFF7ED" },
              ]}
            >
              <Ionicons
                name="car-outline"
                size={25}
                color="#F59E0B"
              />
            </View>

            <Text style={styles.actionTitle}>
              My Vehicle
            </Text>

            <Text style={styles.actionSubtitle}>
              Vehicle details
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() =>
              showComingSoon("Driver Support")
            }
          >
            <View
              style={[
                styles.actionIcon,
                { backgroundColor: "#F5F3FF" },
              ]}
            >
              <Ionicons
                name="headset-outline"
                size={25}
                color="#8B5CF6"
              />
            </View>

            <Text style={styles.actionTitle}>
              Support
            </Text>

            <Text style={styles.actionSubtitle}>
              We're here to help
            </Text>
          </TouchableOpacity>
        </View>

        {/* ================= DAILY GOAL ================= */}

        <View style={styles.goalCard}>
          <View style={styles.goalHeader}>
            <View>
              <Text style={styles.goalLabel}>
                DAILY GOAL
              </Text>

              <Text style={styles.goalTitle}>
                Keep the momentum going
              </Text>
            </View>

            <View style={styles.goalIcon}>
              <Ionicons
                name="trophy-outline"
                size={24}
                color="#208AEF"
              />
            </View>
          </View>

          <View style={styles.progressRow}>
            <Text style={styles.progressText}>
              8 / 10 rides
            </Text>

            <Text style={styles.progressPercent}>
              80%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View style={styles.progressFill} />
          </View>

          <Text style={styles.goalFooter}>
            Just 2 more rides to complete today's goal 🚀
          </Text>
        </View>

        {/* ================= LOGOUT ================= */}

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={logout}
        >
          <Ionicons
            name="log-out-outline"
            size={21}
            color="#EF4444"
          />

          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>

        <Text style={styles.version}>
          RISHI RIDES • DRIVER 1.0
        </Text>
      </ScrollView>

      {/* ================= BOTTOM NAVIGATION ================= */}

      <View style={styles.bottomNav}>
        <TouchableOpacity
          style={styles.navItem}
          onPress={() => setActiveTab("Home")}
        >
          <Ionicons
            name={
              activeTab === "Home"
                ? "home"
                : "home-outline"
            }
            size={23}
            color={
              activeTab === "Home"
                ? "#208AEF"
                : "#94A3B8"
            }
          />

          <Text
            style={[
              styles.navText,
              activeTab === "Home" &&
                styles.navTextActive,
            ]}
          >
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab("Rides");
            showComingSoon("Rides");
          }}
        >
          <Ionicons
            name="car-outline"
            size={23}
            color={
              activeTab === "Rides"
                ? "#208AEF"
                : "#94A3B8"
            }
          />

          <Text
            style={[
              styles.navText,
              activeTab === "Rides" &&
                styles.navTextActive,
            ]}
          >
            Rides
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.centerNav}
          onPress={toggleOnline}
        >
          <View style={styles.centerNavCircle}>
            <Ionicons
              name={online ? "power" : "power-outline"}
              size={25}
              color="#FFFFFF"
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab("Earnings");
            showComingSoon("Earnings");
          }}
        >
          <Ionicons
            name="wallet-outline"
            size={23}
            color={
              activeTab === "Earnings"
                ? "#208AEF"
                : "#94A3B8"
            }
          />

          <Text
            style={[
              styles.navText,
              activeTab === "Earnings" &&
                styles.navTextActive,
            ]}
          >
            Earnings
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navItem}
          onPress={() => {
            setActiveTab("Profile");
            showComingSoon("Driver Profile");
          }}
        >
          <Ionicons
            name="person-outline"
            size={23}
            color={
              activeTab === "Profile"
                ? "#208AEF"
                : "#94A3B8"
            }
          />

          <Text
            style={[
              styles.navText,
              activeTab === "Profile" &&
                styles.navTextActive,
            ]}
          >
            Profile
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 120,
  },

  /* HEADER */

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  smallHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#16A34A",
    marginRight: 7,
  },

  liveText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#64748B",
  },

  heading: {
    fontSize: 17,
    color: "#64748B",
    marginBottom: 2,
  },

  driverName: {
    fontSize: 29,
    fontWeight: "900",
    color: "#0F172A",
  },

  notificationButton: {
    width: 50,
    height: 50,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  notificationBadge: {
    position: "absolute",
    top: 7,
    right: 7,
    minWidth: 17,
    height: 17,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: "#EF4444",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  notificationBadgeText: {
    color: "#FFFFFF",
    fontSize: 8,
    fontWeight: "900",
  },

  /* STATUS */

  statusContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 19,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#DBEAFE",
    overflow: "hidden",
  },

  statusGlow: {
    position: "absolute",
    width: 130,
    height: 130,
    borderRadius: 70,
    backgroundColor: "#EFF6FF",
    right: -45,
    top: -55,
  },

  statusTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusIdentity: {
    flexDirection: "row",
    alignItems: "center",
  },

  carCircle: {
    width: 52,
    height: 52,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  carCircleOnline: {
    backgroundColor: "#208AEF",
  },

  carCircleOffline: {
    backgroundColor: "#64748B",
  },

  statusLabel: {
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.2,
    color: "#94A3B8",
  },

  statusTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 3,
  },

  statusDivider: {
    height: 1,
    backgroundColor: "#E2E8F0",
    marginVertical: 16,
  },

  statusBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statusInfo: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusInfoText: {
    color: "#64748B",
    fontSize: 12,
    marginLeft: 7,
  },

  statusPill: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },

  statusPillOnline: {
    backgroundColor: "#DCFCE7",
  },

  statusPillOffline: {
    backgroundColor: "#F1F5F9",
  },

  statusPillText: {
    fontSize: 9,
    fontWeight: "900",
  },

  statusPillTextOnline: {
    color: "#16A34A",
  },

  statusPillTextOffline: {
    color: "#64748B",
  },

  /* SECTION */

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 13,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "900",
    color: "#0F172A",
    marginBottom: 13,
  },

  viewText: {
    color: "#208AEF",
    fontSize: 12,
    fontWeight: "800",
  },

  /* STATS */

  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },

  largeStat: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  statIconBlue: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
  },

  increaseBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },

  increaseText: {
    color: "#16A34A",
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 3,
  },

  statNumber: {
    fontSize: 31,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 13,
  },

  statDescription: {
    color: "#64748B",
    fontSize: 12,
    marginTop: 2,
  },

  smallStat: {
    width: (width - 50) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statIconGreen: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  statIconOrange: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#FFF7ED",
    alignItems: "center",
    justifyContent: "center",
  },

  smallStatNumber: {
    fontSize: 22,
    fontWeight: "900",
    color: "#0F172A",
    marginTop: 11,
  },

  smallStatDescription: {
    color: "#64748B",
    fontSize: 11,
    marginTop: 2,
  },

  /* LIVE BADGE */

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginBottom: 13,
  },

  liveSmallDot: {
    width: 6,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#16A34A",
    marginRight: 5,
  },

  liveBadgeText: {
    color: "#16A34A",
    fontSize: 9,
    fontWeight: "900",
  },

  /* RADAR */

  radarCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 23,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 28,
  },

  mapBackground: {
    height: 175,
    backgroundColor: "#E8F2FA",
    overflow: "hidden",
    position: "relative",
  },

  mapLineOne: {
    position: "absolute",
    width: 350,
    height: 1,
    backgroundColor: "#C7D8E6",
    transform: [{ rotate: "22deg" }],
    top: 40,
    left: -40,
  },

  mapLineTwo: {
    position: "absolute",
    width: 350,
    height: 1,
    backgroundColor: "#C7D8E6",
    transform: [{ rotate: "-17deg" }],
    top: 105,
    left: -20,
  },

  mapLineThree: {
    position: "absolute",
    width: 300,
    height: 1,
    backgroundColor: "#C7D8E6",
    transform: [{ rotate: "70deg" }],
    top: 10,
    left: 120,
  },

  mapLineFour: {
    position: "absolute",
    width: 250,
    height: 1,
    backgroundColor: "#C7D8E6",
    transform: [{ rotate: "-65deg" }],
    top: 20,
    right: -60,
  },

  mapRoadOne: {
    position: "absolute",
    width: 400,
    height: 12,
    backgroundColor: "#F8FAFC",
    transform: [{ rotate: "-28deg" }],
    top: 75,
    left: -80,
  },

  mapRoadTwo: {
    position: "absolute",
    width: 330,
    height: 9,
    backgroundColor: "#F8FAFC",
    transform: [{ rotate: "38deg" }],
    top: 105,
    right: -80,
  },

  locationPin: {
    position: "absolute",
    left: "46%",
    top: "36%",
    width: 43,
    height: 43,
    borderRadius: 23,
    backgroundColor: "#208AEF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },

  pinPulse: {
    position: "absolute",
    width: 70,
    height: 70,
    borderRadius: 40,
    backgroundColor: "#93C5FD",
    opacity: 0.35,
  },

  mapLabel: {
    position: "absolute",
    top: 15,
    left: 15,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
  },

  mapLabelText: {
    color: "#334155",
    fontSize: 10,
    fontWeight: "800",
    marginLeft: 4,
  },

  radarBottom: {
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  radarTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0F172A",
  },

  radarSubtitle: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 3,
  },

  radarNumberContainer: {
    alignItems: "flex-end",
  },

  radarNumber: {
    fontSize: 25,
    fontWeight: "900",
    color: "#208AEF",
  },

  radarRequests: {
    color: "#94A3B8",
    fontSize: 9,
  },

  radarButton: {
    marginHorizontal: 17,
    marginBottom: 17,
    height: 47,
    borderRadius: 14,
    backgroundColor: "#208AEF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
  },

  radarButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },

  /* RIDE */

  rideCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 28,
  },

  rideTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  rideIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: "#EFF6FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },

  rideStatus: {
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1,
    color: "#208AEF",
  },

  rideMainText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F172A",
    marginTop: 3,
  },

  rideStatusDot: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#ECFDF5",
    alignItems: "center",
    justifyContent: "center",
  },

  rideGreenDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#16A34A",
  },

  routeContainer: {
    flexDirection: "row",
    marginTop: 22,
  },

  routeLineContainer: {
    width: 25,
    alignItems: "center",
    paddingTop: 4,
  },

  routeCircleBlue: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#208AEF",
  },

  routeLine: {
    width: 2,
    height: 39,
    backgroundColor: "#CBD5E1",
    marginVertical: 3,
  },

  routeCircleGray: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#94A3B8",
  },

  routeTexts: {
    flex: 1,
  },

  routeSmall: {
    fontSize: 8,
    fontWeight: "900",
    color: "#94A3B8",
    letterSpacing: 1,
  },

  routeText: {
    fontSize: 13,
    color: "#334155",
    fontWeight: "700",
    marginTop: 2,
  },

  routeTextMuted: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 2,
  },

  acceptButton: {
    height: 48,
    borderRadius: 14,
    backgroundColor: "#208AEF",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 7,
    marginTop: 20,
  },

  disabledButton: {
    backgroundColor: "#94A3B8",
  },

  acceptButtonText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 13,
  },

  /* ACTIONS */

  actionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 11,
    marginBottom: 28,
  },

  actionCard: {
    width: (width - 51) / 2,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  actionIcon: {
    width: 45,
    height: 45,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },

  actionTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },

  actionSubtitle: {
    fontSize: 10,
    color: "#94A3B8",
    marginTop: 4,
  },

  /* GOAL */

  goalCard: {
    backgroundColor: "#EFF6FF",
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: "#BFDBFE",
    marginBottom: 25,
  },

  goalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  goalLabel: {
    fontSize: 8,
    color: "#208AEF",
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  goalTitle: {
    fontSize: 15,
    color: "#0F172A",
    fontWeight: "800",
    marginTop: 5,
  },

  goalIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  progressRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 7,
  },

  progressText: {
    fontSize: 11,
    color: "#64748B",
    fontWeight: "700",
  },

  progressPercent: {
    fontSize: 11,
    color: "#208AEF",
    fontWeight: "900",
  },

  progressBackground: {
    height: 8,
    borderRadius: 5,
    backgroundColor: "#DBEAFE",
    overflow: "hidden",
  },

  progressFill: {
    width: "80%",
    height: "100%",
    backgroundColor: "#208AEF",
    borderRadius: 5,
  },

  goalFooter: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 10,
  },

  /* LOGOUT */

  logoutButton: {
    height: 51,
    borderRadius: 15,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },

  logoutText: {
    color: "#EF4444",
    fontWeight: "800",
    fontSize: 13,
  },

  version: {
    textAlign: "center",
    fontSize: 8,
    color: "#CBD5E1",
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 17,
  },

  /* BOTTOM NAV */

  bottomNav: {
    position: "absolute",
    left: 15,
    right: 15,
    bottom: 12,
    height: 70,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    elevation: 10,
    shadowColor: "#0F172A",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.08,
    shadowRadius: 15,
  },

  navItem: {
    width: 58,
    height: 58,
    alignItems: "center",
    justifyContent: "center",
  },

  navText: {
    fontSize: 8,
    fontWeight: "700",
    color: "#94A3B8",
    marginTop: 4,
  },

  navTextActive: {
    color: "#208AEF",
  },

  centerNav: {
    width: 65,
    height: 65,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -25,
  },

  centerNavCircle: {
    width: 57,
    height: 57,
    borderRadius: 30,
    backgroundColor: "#208AEF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 5,
    borderColor: "#FFFFFF",
    elevation: 7,
    shadowColor: "#208AEF",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});

