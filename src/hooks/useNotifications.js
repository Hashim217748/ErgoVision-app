import { useState, useEffect, useRef } from "react";
import { Platform, Alert } from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

// Configure how notifications are displayed when the app is in the foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const SERVER_URL = "http://192.168.100.145:3000";

/**
 * Registers the device for push notifications, uploads the Expo Push Token
 * to the server, and wires up foreground notification listeners.
 *
 * @param {string|null} userId - The logged-in user's ID. Pass null to skip registration.
 * @returns {{ expoPushToken: string|null, notification: object|null }}
 */
export function useNotifications(userId) {
  const [expoPushToken, setExpoPushToken] = useState(null);
  const [notification, setNotification] = useState(null);

  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    if (!userId) return;

    registerForPushNotificationsAsync(userId).then((token) => {
      if (token) setExpoPushToken(token);
    });

    // Listener: notification received while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notif) => {
        setNotification(notif);
      });

    // Listener: user tapped the notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification tapped:", response);
      });

    return () => {
      if (notificationListener.current)
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );
      if (responseListener.current)
        Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, [userId]);

  return { expoPushToken, notification };
}

/**
 * Requests push notification permissions, obtains an Expo Push Token,
 * and registers it with the ErgoVision server.
 */
async function registerForPushNotificationsAsync(userId) {
  if (!Device.isDevice) {
    console.log(
      "Push notifications only work on physical devices — skipping registration."
    );
    return null;
  }

  // Check / request permission
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    Alert.alert(
      "Permission Required",
      "Enable notifications to receive posture alerts from your desktop app.",
      [{ text: "OK" }]
    );
    return null;
  }

  // Android needs a notification channel
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("posture-alerts", {
      name: "Posture Alerts",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF6B35",
      sound: true,
    });
  }

  try {
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: undefined, // Uses app.json's extra.eas.projectId if available
    });
    const token = tokenData.data;
    console.log("Expo Push Token:", token);

    // Register token with the server
    await fetch(`${SERVER_URL}/api/register-push-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, expoPushToken: token }),
    });

    return token;
  } catch (error) {
    console.log("Error getting push token:", error.message);
    return null;
  }
}
