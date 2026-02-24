import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { theme, isDark, toggleTheme, currentPaletteName, cyclePalette } =
    useTheme();
  const { user, dashboardData } = useUser();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    headerGradient: {
      paddingTop: 50,
      paddingBottom: 40,
      paddingHorizontal: 20,
      borderBottomLeftRadius: 30,
      borderBottomRightRadius: 30,
    },
    headerTopRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    headerTitle: {
      color: "rgba(255, 255, 255, 0.9)",
      fontSize: 16,
      fontWeight: "500",
    },
    headerSubtitle: {
      color: "rgba(255, 255, 255, 0.7)",
      fontSize: 12,
      marginTop: 2,
    },
    headerIcons: {
      flexDirection: "row",
      gap: 10,
    },
    iconButton: {
      width: 36,
      height: 36,
      borderRadius: 18,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    profileRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 20,
    },
    userName: {
      color: "#FFF",
      fontSize: 32,
      fontWeight: "bold",
    },
    streakBadge: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 20,
      flexDirection: "row",
      alignItems: "center",
      marginTop: 8,
      alignSelf: "flex-start",
    },
    streakText: {
      color: "#FFF",
      marginLeft: 6,
      fontSize: 12,
      fontWeight: "600",
    },
    levelContainer: {
      alignItems: "center",
    },
    levelBadgeOuter: {
      width: 70,
      height: 70,
      borderRadius: 35,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    levelBadgeInner: {
      width: 54,
      height: 54,
      borderRadius: 27,
      backgroundColor: "#1E243A",
      justifyContent: "center",
      alignItems: "center",
    },
    levelPill: {
      backgroundColor: theme.colors.warning,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 10,
      position: "absolute",
      bottom: -8,
    },
    levelPillText: {
      color: "#FFF",
      fontSize: 10,
      fontWeight: "bold",
    },
    levelText: {
      color: "#FFF",
      fontSize: 12,
      marginTop: 12,
      opacity: 0.8,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    card: {
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
    },
    levelCardTop: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    levelCardLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    levelCardTitleRow: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    levelCardTitle: {
      color: theme.colors.textPrimary,
      fontSize: 20,
      fontWeight: "bold",
      marginLeft: 8,
    },
    xpBadge: {
      backgroundColor: "rgba(255, 107, 53, 0.1)",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
    },
    xpText: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: "600",
    },
    progressRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 20,
      marginBottom: 8,
    },
    progressText: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    progressPercent: {
      color: theme.colors.primary,
      fontSize: 12,
      fontWeight: "bold",
    },
    progressBarBackground: {
      height: 8,
      backgroundColor: theme.colors.surface,
      borderRadius: 4,
    },
    progressBarFill: {
      height: 8,
      borderRadius: 4,
      width: "31%", // mockup
    },
    progressIconsRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginTop: 8,
    },
    progressIconLvl: {
      color: theme.colors.textSecondary,
      fontSize: 10,
      marginTop: 4,
    },
    sectionTitleRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 15,
    },
    sectionTitle: {
      color: theme.colors.textPrimary,
      fontSize: 18,
      fontWeight: "bold",
    },
    overviewGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
    },
    gridItem: {
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 16,
      width: "48%",
      padding: 15,
      marginBottom: 15,
    },
    gridIconBox: {
      width: 40,
      height: 40,
      borderRadius: 12,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 12,
    },
    gridItemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    gridPill: {
      backgroundColor: "rgba(16, 185, 129, 0.1)",
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 8,
      height: 20,
    },
    gridPillText: {
      color: theme.colors.success,
      fontSize: 10,
      fontWeight: "bold",
    },
    gridValue: {
      color: theme.colors.textPrimary,
      fontSize: 24,
      fontWeight: "bold",
    },
    gridLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },
    dailyTipCard: {
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 20,
      padding: 20,
      marginBottom: 20,
      borderLeftWidth: 4,
      borderLeftColor: theme.colors.primary,
    },
    tipHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 8,
    },
    tipTitleText: {
      color: theme.colors.danger,
      fontSize: 12,
      fontWeight: "bold",
      marginLeft: 8,
      letterSpacing: 1,
    },
    tipTitle: {
      color: theme.colors.textPrimary,
      fontSize: 16,
      fontWeight: "bold",
      marginBottom: 6,
    },
    tipDesc: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    achievementItem: {
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },
    achievementIconBox: {
      width: 48,
      height: 48,
      borderRadius: 12,
      backgroundColor: theme.colors.surface,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
      position: "relative",
    },
    achievementCheck: {
      position: "absolute",
      bottom: -4,
      right: -4,
      backgroundColor: theme.colors.success,
      borderRadius: 10,
      width: 20,
      height: 20,
      justifyContent: "center",
      alignItems: "center",
    },
    achievementTitle: {
      color: theme.colors.textPrimary,
      fontSize: 15,
      fontWeight: "600",
    },
    achievementDate: {
      color: theme.colors.accent,
      fontSize: 12,
      marginTop: 4,
    },
    thisWeekCard: {
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 20,
      padding: 20,
      marginTop: 10,
    },
    thisWeekTitle: {
      color: theme.colors.textSecondary,
      fontSize: 14,
      textAlign: "center",
      marginBottom: 20,
    },
    thisWeekRow: {
      flexDirection: "row",
      justifyContent: "space-around",
    },
    thisWeekCol: {
      alignItems: "center",
    },
    thisWeekValue: {
      color: theme.colors.textPrimary,
      fontSize: 22,
      fontWeight: "bold",
    },
    thisWeekLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },
    divider: {
      width: 1,
      height: 40,
      backgroundColor: theme.colors.surface,
    },
  });

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={theme.colors.primaryGradient}
          style={styles.headerGradient}
        >
          <View style={styles.headerTopRow}>
            <View>
              <Text style={styles.headerTitle}>Good evening,</Text>
              <Text style={styles.headerSubtitle}>
                {currentPaletteName} Theme
              </Text>
            </View>
            <View style={styles.headerIcons}>
              <TouchableOpacity
                style={styles.iconButton}
                onPress={cyclePalette}
              >
                <Ionicons name="color-palette" size={20} color="#FFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton} onPress={toggleTheme}>
                <Ionicons
                  name={isDark ? "sunny" : "moon"}
                  size={20}
                  color="#FFF"
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.profileRow}>
            <View>
              <Text style={styles.userName}>{user.name}!</Text>
            </View>
            <View style={styles.levelContainer}>
              <View style={styles.levelBadgeOuter}>
                <View style={styles.levelBadgeInner}>
                  <FontAwesome5
                    name="gem"
                    size={24}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.levelPill}>
                  <Text style={styles.levelPillText}>LVL {user.level}</Text>
                </View>
              </View>
              <Text style={styles.levelText}>{user.levelName}</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.scrollContent}>
          {/* Status Card based exclusively on DB info */}
          <View style={styles.card}>
            <View style={styles.levelCardTop}>
              <View>
                <Text style={styles.levelCardLabel}>Current Rank</Text>
                <View style={styles.levelCardTitleRow}>
                  <FontAwesome5
                    name="gem"
                    size={18}
                    color={theme.colors.primary}
                  />
                  <Text style={styles.levelCardTitle}>{user.levelName}</Text>
                </View>
              </View>
              <View style={styles.xpBadge}>
                <Text style={styles.xpText}>{user.xp} XP Earned</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Today's Overview</Text>
          <View style={styles.overviewGrid}>
            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <View
                  style={[
                    styles.gridIconBox,
                    { backgroundColor: "rgba(255, 107, 53, 0.1)" },
                  ]}
                >
                  <FontAwesome5
                    name="child"
                    size={18}
                    color={theme.colors.primary}
                  />
                </View>
                <View style={styles.gridPill}>
                  <Text style={styles.gridPillText}>+4%</Text>
                </View>
              </View>
              <Text style={styles.gridValue}>
                {dashboardData.postureScore}%
              </Text>
              <Text style={styles.gridLabel}>Posture Score</Text>
            </View>

            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <View
                  style={[
                    styles.gridIconBox,
                    { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                  ]}
                >
                  <Ionicons name="time-outline" size={20} color="#3B82F6" />
                </View>
              </View>
              <Text style={styles.gridValue}>
                {dashboardData.hoursTracked}h
              </Text>
              <Text style={styles.gridLabel}>Hours Tracked</Text>
            </View>

            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <View
                  style={[
                    styles.gridIconBox,
                    { backgroundColor: "rgba(16, 185, 129, 0.1)" },
                  ]}
                >
                  <Feather
                    name="coffee"
                    size={18}
                    color={theme.colors.success}
                  />
                </View>
              </View>
              <Text style={styles.gridValue}>{dashboardData.breaksTaken}</Text>
              <Text style={styles.gridLabel}>Breaks Taken</Text>
            </View>

            <View style={styles.gridItem}>
              <View style={styles.gridItemHeader}>
                <View
                  style={[
                    styles.gridIconBox,
                    { backgroundColor: "rgba(139, 92, 246, 0.1)" },
                  ]}
                >
                  <FontAwesome5
                    name="list-alt"
                    size={18}
                    color={theme.colors.primary} // Reusing primary color for the icon
                  />
                </View>
              </View>
              <Text style={styles.gridValue}>{user.streak}</Text>
              <Text style={styles.gridLabel}>Total Sessions</Text>
            </View>
          </View>

          <View style={styles.thisWeekCard}>
            <Text style={styles.thisWeekTitle}>This Week</Text>
            <View style={styles.thisWeekRow}>
              <View style={styles.thisWeekCol}>
                <Text style={styles.thisWeekValue}>
                  {dashboardData.thisWeek.avgScore}%
                </Text>
                <Text style={styles.thisWeekLabel}>Avg Score</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.thisWeekCol}>
                <Text style={styles.thisWeekValue}>
                  {dashboardData.thisWeek.tracked}h
                </Text>
                <Text style={styles.thisWeekLabel}>Tracked</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.thisWeekCol}>
                <Text
                  style={[styles.thisWeekValue, { color: theme.colors.accent }]}
                >
                  {dashboardData.thisWeek.improvement}
                </Text>
                <Text style={styles.thisWeekLabel}>Improvement</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
