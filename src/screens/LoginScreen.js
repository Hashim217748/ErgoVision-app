import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useUser } from "../context/UserContext";
import { LinearGradient } from "expo-linear-gradient";

export default function LoginScreen() {
  const { theme } = useTheme();
  const { login } = useUser();

  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!loginId || !password) {
      setError("Please fill in both fields");
      return;
    }
    setError("");
    setIsLoading(true);

    try {
      // Connect to local server using local IP so Expo can reach it
      const response = await fetch("http://192.168.100.145:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ loginId: loginId.trim(), password }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        // Found user
        await login(result.user);
      } else {
        setError(result.message || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to server. Is it running?");
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: "center",
      padding: 20,
    },
    logoContainer: {
      alignItems: "center",
      marginBottom: 50,
    },
    title: {
      fontSize: 32,
      fontWeight: "bold",
      color: theme.colors.textPrimary,
      marginTop: 10,
    },
    subtitle: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      marginTop: 5,
    },
    form: {
      backgroundColor: theme.colors.backgroundCard,
      padding: 20,
      borderRadius: 20,
      elevation: 5,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
    },
    inputContainer: {
      marginBottom: 20,
    },
    label: {
      color: theme.colors.textSecondary,
      marginBottom: 8,
      fontSize: 14,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: 12,
      padding: 15,
      color: theme.colors.textPrimary,
      fontSize: 16,
    },
    errorText: {
      color: theme.colors.danger,
      marginBottom: 15,
      textAlign: "center",
    },
    loginButton: {
      borderRadius: 12,
      overflow: "hidden",
      marginTop: 10,
    },
    gradientBtn: {
      paddingVertical: 15,
      alignItems: "center",
    },
    btnText: {
      color: "#FFF",
      fontSize: 16,
      fontWeight: "bold",
    },
    testHint: {
      color: theme.colors.accent,
      textAlign: "center",
      marginTop: 20,
      fontSize: 12,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Text style={styles.title}>ErgoVision</Text>
        <Text style={styles.subtitle}>Welcome back</Text>
      </View>

      <View style={styles.form}>
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email or Username</Text>
          <TextInput
            style={styles.input}
            placeholder="Username or test@example.com"
            placeholderTextColor={theme.colors.textSecondary}
            value={loginId}
            onChangeText={setLoginId}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={theme.colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <LinearGradient
            colors={theme.colors.primaryGradient}
            style={styles.gradientBtn}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.btnText}>Sign In</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <Text style={styles.testHint}>
          Hint: Try logging in with the email you registered in the desktop app.
        </Text>
      </View>
    </View>
  );
}
