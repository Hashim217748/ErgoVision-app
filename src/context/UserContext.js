import React, { createContext, useState, useContext, useEffect } from "react";
import { Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // null means not logged in
  const [loading, setLoading] = useState(false); // Authentication loading state

  const [dashboardData, setDashboardData] = useState({
    postureScore: 0,
    hoursTracked: 0,
    breaksTaken: 0,
    alerts: 0,
    thisWeek: {
      avgScore: 0,
      tracked: 0,
      improvement: "0%",
    },
    chartData: {
      scores: [0, 0, 0, 0, 0, 0, 0],
      dates: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  });

  // Check storage on initial load
  useEffect(() => {
    const loadStoredUser = async () => {
      try {
        const storedUserData = await AsyncStorage.getItem("userData");
        if (storedUserData) {
          const parsedUser = JSON.parse(storedUserData);
          setUser(parsedUser);
          await fetchDashboardData(parsedUser.id);
        }
      } catch (error) {
        console.log("Error loading user from storage:", error);
      }
    };
    loadStoredUser();
  }, []);

  const login = async (userData) => {
    setUser(userData);
    try {
      await AsyncStorage.setItem("userData", JSON.stringify(userData));
    } catch (e) {
      console.log("Error saving user state:", e);
    }
    // Fetch their specific data immediately
    await fetchDashboardData(userData.id);
  };

  const logout = async () => {
    setUser(null);
    try {
      await AsyncStorage.removeItem("userData");
    } catch (e) {
      console.log("Error removing user state:", e);
    }
    setDashboardData({
      // Reset
      postureScore: 0,
      hoursTracked: 0,
      breaksTaken: 0,
      alerts: 0,
      thisWeek: { avgScore: 0, tracked: 0, improvement: "0%" },
      chartData: { scores: [0, 0, 0, 0, 0, 0, 0], dates: [] },
    });
  };

  const fetchDashboardData = async (userId) => {
    if (!userId) return;
    setLoading(true);
    try {
      const response = await fetch(
        `http://192.168.100.145:3000/api/dashboard?userId=${userId}`,
      );
      if (response.ok) {
        const result = await response.json();
        if (result.status === "success") {
          setDashboardData({
            ...dashboardData,
            ...result.data,
          });
          // Also update user info if server sent extended profile stats
          if (result.data.userData) {
            setUser((prev) => ({ ...prev, ...result.data.userData }));
          }
        }
      }
    } catch (error) {
      console.log("Error fetching live data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // If user is logged in, periodically refresh data every 60 seconds
    let interval;
    if (user && user.id) {
      interval = setInterval(() => fetchDashboardData(user.id), 60000);
    }
    return () => clearInterval(interval);
  }, [user]);

  return (
    <UserContext.Provider
      value={{
        user,
        dashboardData,
        loading,
        login,
        logout,
        fetchDashboardData,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
