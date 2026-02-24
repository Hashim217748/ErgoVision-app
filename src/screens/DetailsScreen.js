import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function DetailsScreen() {
  const { theme } = useTheme();

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      color: theme.colors.textPrimary,
      fontSize: 18,
    },
  });

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Details Screen</Text>
      <Text
        style={[
          styles.text,
          { fontSize: 14, color: theme.colors.textSecondary, marginTop: 10 },
        ]}
      >
        More detailed ergonomic logs will appear here.
      </Text>
    </View>
  );
}
