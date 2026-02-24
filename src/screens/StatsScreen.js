import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons, FontAwesome5, Feather } from "@expo/vector-icons";
import { LineChart, BarChart } from "react-native-chart-kit";
import { SafeAreaView } from "react-native-safe-area-context";

const screenWidth = Dimensions.get("window").width;

export default function StatsScreen() {
  const { theme } = useTheme();
  const { dashboardData } = useUser();
  const [activeTab, setActiveTab] = useState("Week");

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 50,
      paddingHorizontal: 20,
      paddingBottom: 20,
      backgroundColor: theme.colors.background,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.textPrimary,
    },
    subtitle: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 4,
    },
    tabsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      marginTop: 20,
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 20,
      padding: 4,
      marginHorizontal: 20,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
    },
    tabItem: {
      flex: 1,
      paddingVertical: 10,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: 16,
    },
    tabItemActive: {
      backgroundColor: "transparent",
    },
    tabText: {
      color: theme.colors.textSecondary,
      fontWeight: "600",
    },
    tabTextActive: {
      color: "#FFF",
    },
    tabGradient: {
      position: "absolute",
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      borderRadius: 16,
    },
    scrollContent: {
      padding: 20,
      paddingBottom: 40,
    },
    avgScoreCard: {
      borderRadius: 16,
      padding: 20,
      marginBottom: 25,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      elevation: 4,
      shadowColor: "#FF6B35",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
    },
    avgLabel: {
      color: "rgba(255,255,255,0.8)",
      fontSize: 12,
    },
    avgValue: {
      color: "#FFF",
      fontSize: 36,
      fontWeight: "bold",
      marginTop: 4,
      marginBottom: 8,
    },
    avgPill: {
      backgroundColor: "rgba(255,255,255,0.2)",
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 12,
      flexDirection: "row",
      alignItems: "center",
      alignSelf: "flex-start",
    },
    avgPillText: {
      color: "#FFF",
      fontSize: 12,
      marginLeft: 4,
      fontWeight: "600",
    },
    chartIconBox: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor: "rgba(255,255,255,0.2)",
      justifyContent: "center",
      alignItems: "center",
    },
    sectionTitle: {
      color: theme.colors.textPrimary,
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 15,
    },
    chartCard: {
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 20,
      padding: 15,
      marginBottom: 25,
      alignItems: "center",
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    quickStatsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "space-between",
      marginBottom: 25,
    },
    qsCard: {
      backgroundColor: theme.colors.backgroundCard,
      width: "48%",
      borderRadius: 16,
      padding: 20,
      alignItems: "center",
      marginBottom: 15,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    qsValue: {
      color: theme.colors.textPrimary,
      fontSize: 22,
      fontWeight: "bold",
      marginTop: 10,
    },
    qsLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },
    insightCard: {
      backgroundColor: theme.colors.backgroundCard,
      borderRadius: 16,
      padding: 16,
      flexDirection: "row",
      marginBottom: 15,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 4,
    },
    insightIconBox: {
      width: 44,
      height: 44,
      borderRadius: 12,
      backgroundColor: theme.colors.iconBackground,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 15,
    },
    insightTitle: {
      color: theme.colors.textPrimary,
      fontSize: 14,
      fontWeight: "bold",
      marginBottom: 4,
    },
    insightDesc: {
      color: theme.colors.textSecondary,
      fontSize: 12,
      lineHeight: 18,
      paddingRight: 40,
    },
  });

  const chartConfig = {
    backgroundGradientFrom: theme.colors.backgroundCard,
    backgroundGradientTo: theme.colors.backgroundCard,
    color: (opacity = 1) => theme.colors.accent,
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
    decimalPlaces: 0,
    labelColor: () => theme.colors.textSecondary,
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: theme.colors.accent,
    },
  };

  const lineData = {
    labels:
      dashboardData.chartData?.dates?.length > 0
        ? dashboardData.chartData.dates
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data:
          dashboardData.chartData?.scores?.length > 0
            ? dashboardData.chartData.scores
            : [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  const barData = {
    labels:
      dashboardData.chartData?.dates?.length > 0
        ? dashboardData.chartData.dates
        : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        data:
          dashboardData.chartData?.scores?.length > 0
            ? dashboardData.chartData.scores
            : [0, 0, 0, 0, 0, 0, 0],
      },
    ],
  };

  const renderTab = (title) => {
    const isActive = activeTab === title;
    return (
      <TouchableOpacity
        style={[styles.tabItem, isActive && styles.tabItemActive]}
        onPress={() => setActiveTab(title)}
        activeOpacity={0.8}
        key={title}
      >
        {isActive && (
          <LinearGradient
            colors={theme.colors.primaryGradient}
            style={styles.tabGradient}
          />
        )}
        <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistics</Text>
        <Text style={styles.subtitle}>Track your ergonomic progress</Text>
      </View>

      <View style={styles.tabsContainer}>
        {["Today", "Week", "Month"].map(renderTab)}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollContent}
      >
        <LinearGradient
          colors={theme.colors.primaryGradient}
          style={styles.avgScoreCard}
        >
          <View>
            <Text style={styles.avgLabel}>Average Posture Score</Text>
            <Text style={styles.avgValue}>
              {dashboardData.thisWeek.avgScore}%
            </Text>
            <View style={styles.avgPill}>
              <Ionicons name="trending-up" size={14} color="#FFF" />
              <Text style={styles.avgPillText}>
                {dashboardData.thisWeek.improvement} from last period
              </Text>
            </View>
          </View>
          <View style={styles.chartIconBox}>
            <Ionicons name="stats-chart" size={24} color="#FFF" />
          </View>
        </LinearGradient>

        <Text style={styles.sectionTitle}>Posture Score Trend</Text>
        <View style={styles.chartCard}>
          <LineChart
            data={lineData}
            width={screenWidth - 70}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={{ borderRadius: 16 }}
            withInnerLines={true}
            withOuterLines={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Daily Comparison</Text>
        <View style={styles.chartCard}>
          <BarChart
            data={barData}
            width={screenWidth - 70}
            height={220}
            chartConfig={{
              ...chartConfig,
              color: (opacity = 1) => `rgba(38, 166, 154, ${opacity})`,
            }}
            style={{ borderRadius: 16 }}
            showValuesOnTopOfBars={false}
            withInnerLines={false}
          />
        </View>

        <Text style={styles.sectionTitle}>Quick Stats</Text>
        <View style={styles.quickStatsGrid}>
          <View style={styles.qsCard}>
            <Ionicons name="time-outline" size={24} color="#3B82F6" />
            <Text style={styles.qsValue}>
              {dashboardData.thisWeek.tracked}h
            </Text>
            <Text style={styles.qsLabel}>Hours Tracked</Text>
          </View>
          <View style={styles.qsCard}>
            <Feather name="coffee" size={24} color={theme.colors.success} />
            <Text style={styles.qsValue}>{dashboardData.breaksTaken}</Text>
            <Text style={styles.qsLabel}>Breaks Taken</Text>
          </View>
          <View style={styles.qsCard}>
            <Ionicons
              name="trophy-outline"
              size={24}
              color={theme.colors.danger}
            />
            <Text style={styles.qsValue}>
              {dashboardData.thisWeek.improvement}
            </Text>
            <Text style={styles.qsLabel}>Improvement</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
