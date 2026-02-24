import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { user, logout } = useUser();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingTop: 60,
      paddingHorizontal: 20,
      paddingBottom: 20,
    },
    title: {
      fontSize: 28,
      fontWeight: "bold",
      color: theme.colors.textPrimary,
    },
    profileCard: {
      backgroundColor: theme.colors.backgroundCard,
      margin: 20,
      padding: 20,
      borderRadius: 20,
      alignItems: "center",
    },
    avatarBox: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: "rgba(255, 107, 53, 0.1)",
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 15,
    },
    name: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.textPrimary,
    },
    email: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 5,
      marginBottom: 20,
    },
    infoRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      paddingHorizontal: 20,
      marginTop: 10,
    },
    infoPill: {
      alignItems: "center",
    },
    infoValue: {
      color: theme.colors.textPrimary,
      fontSize: 18,
      fontWeight: "bold",
      marginTop: 4,
    },
    infoLabel: {
      color: theme.colors.textSecondary,
      fontSize: 12,
    },
    logoutBtn: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: 20,
      marginTop: "auto",
      marginBottom: 40,
      paddingVertical: 15,
      borderRadius: 15,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
    },
    logoutText: {
      color: theme.colors.danger,
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 10,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarBox}>
          <FontAwesome5
            name="user-alt"
            size={32}
            color={theme.colors.primary}
          />
        </View>
        <Text style={styles.name}>{user?.name || "User"}</Text>
        <Text style={styles.email}>{user?.email || "user@example.com"}</Text>

        <View style={styles.infoRow}>
          <View style={styles.infoPill}>
            <Ionicons
              name="shield-checkmark"
              size={24}
              color={theme.colors.success}
            />
            <Text style={styles.infoValue}>Active</Text>
            <Text style={styles.infoLabel}>Status</Text>
          </View>
          <View style={styles.infoPill}>
            <FontAwesome5 name="fire" size={24} color={theme.colors.danger} />
            <Text style={styles.infoValue}>{user?.streak || 0}</Text>
            <Text style={styles.infoLabel}>Streak</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Ionicons
          name="log-out-outline"
          size={20}
          color={theme.colors.danger}
        />
        <Text style={styles.logoutText}>Log Out</Text>
      </TouchableOpacity>
    </View>
  );
}
