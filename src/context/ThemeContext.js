import React, { createContext, useState, useContext } from "react";

// The Base Themes control the background style (Light vs Dark)
const baseLightTheme = {
  background: "#F8F9FA",
  backgroundCard: "#FFFFFF",
  textPrimary: "#2D3142",
  textSecondary: "#9CA3AF",
  surface: "#E5E7EB",
  iconBackground: "#F3F4F6",
};

const baseDarkTheme = {
  background: "#111625",
  backgroundCard: "#1E243A",
  textPrimary: "#FFFFFF",
  textSecondary: "#9CA3AF",
  surface: "#2A2F4C",
  iconBackground: "#2A2F4C",
};

// The Color Palettes control the vibrant accents
const palettes = {
  sunset: {
    name: "Sunset",
    primary: "#FF6B35",
    primaryGradient: ["#FF8E53", "#FF4E18"],
    accent: "#26A69A",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  ocean: {
    name: "Ocean Depth",
    primary: "#06B6D4", // Bright Cyan
    primaryGradient: ["#2DD4BF", "#0284C7"], // Teal to deep bright blue
    accent: "#38BDF8",
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#F43F5E",
  },
  forest: {
    name: "Lush Forest",
    primary: "#10B981",
    primaryGradient: ["#4ADE80", "#059669"], // Very bright neon green to emerald
    accent: "#84CC16",
    success: "#059669",
    warning: "#F59E0B",
    danger: "#EF4444",
  },
  royal: {
    name: "Royal Amethyst",
    primary: "#A855F7",
    primaryGradient: ["#D946EF", "#7E22CE"], // Fuchsia pink to sharp purple
    accent: "#F472B6",
    success: "#10B981",
    warning: "#FBBF24",
    danger: "#EF4444",
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  // Array of available palette keys to cycle through
  const paletteKeys = Object.keys(palettes);
  const [currentPaletteIndex, setCurrentPaletteIndex] = useState(0);

  const toggleBaseTheme = () => setIsDark(!isDark);

  const cyclePalette = () => {
    setCurrentPaletteIndex((prevIndex) => (prevIndex + 1) % paletteKeys.length);
  };

  const activeBase = isDark ? baseDarkTheme : baseLightTheme;
  const activePalette = palettes[paletteKeys[currentPaletteIndex]];

  // Combine the dynamic base and the dynamic palette into a single theme object
  const theme = {
    colors: {
      ...activeBase,
      ...activePalette,
    },
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme,
        toggleTheme: toggleBaseTheme, // Renamed internally but keeping external API
        cyclePalette,
        currentPaletteName: activePalette.name,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
