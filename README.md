<div align="center">

<img src="https://img.shields.io/badge/REACT_NATIVE-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
<img src="https://img.shields.io/badge/EXPO-1B1F23?style=for-the-badge&logo=expo&logoColor=white" alt="Expo" />
<img src="https://img.shields.io/badge/NODE.JS-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
<img src="https://img.shields.io/badge/MONGODB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />

# 🧘‍♂️ ErgoVision

**Your AI-Powered Ergonomic Companion**

ErgoVision is a full-stack, cross-platform mobile dashboard designed to track, analyze, and gamify your posture health in real-time. Built to sync flawlessly with a Desktop Python Computer Vision client, ErgoVision transforms rigid health data into an interactive, visually stunning mobile experience.

[🚀 Getting Started](#-getting-started) • [✨ Key Features](#-key-features) • [🛠 Tech Stack](#-tech-stack) • [🔐 Demo](#-demo-credentials)

</div>

---

## ✨ Key Features

### 📊 Live Posture Analytics

Instantly syncs with your remote MongoDB cluster to display dynamic posture scores, total hours tracked, and breaks taken right from your desk.

### 🎮 Gamified Leveling Engine

Automatically calculates an XP score heavily weighting consistency and session length. Earn XP to climb ranks from _Beginner_ up to _Master_.

### 🎨 Dynamic UI Theming Engine

Switch the entire app's aesthetic payload on the fly. Choose your base aesthetic (Light/Dark mode) and cycle through **4 custom vibrant palettes**:

- 🌇 **Sunset** (Vibrant Oranges)
- 🌊 **Ocean Depth** (Deep Cyan & Teal)
- 🌲 **Lush Forest** (Neon Green & Emerald)
- 👑 **Royal Amethyst** (Fuchsia & Purple)

### 🔒 Secure & Persistent Authentication

Authenticate via Username or Email using SHA-256 encrypted passwords. Employs React Native `AsyncStorage` to natively persist your login session across app reboots silently.

### 📈 Data-Driven Visualizations

Built-in line graphs and bar charts plotting out your weekly history using robust configurations from `react-native-chart-kit`.

---

## 🛠 Tech Stack

| Domain                 | Technology                             |
| ---------------------- | -------------------------------------- |
| **Frontend Framework** | React Native, Expo                     |
| **Navigation**         | React Navigation (Stack + Bottom Tabs) |
| **Backend API**        | Node.js, Express                       |
| **Database**           | MongoDB Atlas                          |
| **Security**           | Crypto (SHA-256)                       |
| **Data Persistence**   | `@react-native-async-storage`          |
| **Data Visualization** | `react-native-chart-kit`               |

---

## 🚀 Getting Started

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) (v16+) and npm installed on your machine. You will also need the [Expo Go](https://expo.dev/client) app installed on your physical mobile device.

### 📥 Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Hashim217748/ErgoVision-app.git
   cd ErgoVision-app
   ```

2. **Install project dependencies:**
   ```bash
   npm install
   ```

### ⚡ Running the Application

You need to run both the Node.js API server (for database communication) and the Expo server (for the mobile UI) simultaneously.

**1. Start the API Backend Server:**
Open a terminal and run:

```bash
node server.js
```

> _The server will spin up on `http://localhost:3000` (or your local Wi-Fi IP). Make sure your mobile device is on the same network._

**2. Start the Expo Mobile App:**
Open a _second_ terminal and run:

```bash
npx expo start
```

> _Use the Expo Go app on iOS/Android to scan the QR code and launch the dashboard._

---

## 🔐 Demo Credentials

To test the connection against the live demonstration database without setting up the Python Desktop Client, use the following credentials on the login screen:

> **Username:** `hashim`  
> **Password:** `asdasd`

---

<div align="center">
  <sub>Built for a healthier, more ergonomic digital lifestyle.</sub>
</div>
