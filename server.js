const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());
app.use(express.json()); // parse JSON bodies for all routes

const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";

const uri =
  "mongodb+srv://test:test123@cluster0.bbkjn7s.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

// ---------------------------------------------------------------------------
// POST /api/register-push-token
// Body: { userId, expoPushToken }
// Stores (or updates) the Expo push token for this user in MongoDB.
// ---------------------------------------------------------------------------
app.post("/api/register-push-token", async (req, res) => {
  try {
    const { userId, expoPushToken } = req.body;
    if (!userId || !expoPushToken) {
      return res
        .status(400)
        .json({ status: "error", message: "userId and expoPushToken are required" });
    }

    await client.connect();
    const db = client.db("ergovision");

    await db.collection("push_tokens").updateOne(
      { userId: String(userId) },
      {
        $set: {
          userId: String(userId),
          expoPushToken,
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    console.log(`[push] Token registered for user ${userId}`);
    res.json({ status: "success" });
  } catch (error) {
    console.error("[push] register-push-token error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// ---------------------------------------------------------------------------
// POST /api/notify-posture
// Body: { userId, message?, severity? }
// Looks up the user's Expo push token and sends a push notification via
// the Expo Push API. Called by the desktop Python app.
// ---------------------------------------------------------------------------
app.post("/api/notify-posture", async (req, res) => {
  try {
    const {
      userId,
      message = "Your posture has been poor for too long. Time to sit up straight!",
      severity = "warning",
    } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ status: "error", message: "userId is required" });
    }

    await client.connect();
    const db = client.db("ergovision");

    const tokenDoc = await db
      .collection("push_tokens")
      .findOne({ userId: String(userId) });

    if (!tokenDoc || !tokenDoc.expoPushToken) {
      console.log(`[push] No token found for user ${userId} — skipping push`);
      return res.json({
        status: "skipped",
        message: "No push token registered for this user",
      });
    }

    const expoPushToken = tokenDoc.expoPushToken;

    // Send via Expo Push API
    const payload = {
      to: expoPushToken,
      title: "🪑 ErgoVision — Posture Alert",
      body: message,
      sound: "default",
      priority: "high",
      data: { severity, userId: String(userId), type: "posture_alert" },
      channelId: "posture-alerts", // used by Android
    };

    const expoResponse = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-Encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const expoResult = await expoResponse.json();

    // Log any delivery errors from Expo
    if (expoResult.data && expoResult.data.status === "error") {
      console.error("[push] Expo delivery error:", expoResult.data);
    } else {
      console.log(`[push] Notification sent to user ${userId}`);
    }

    // Record this alert event in MongoDB for history / analytics
    await db.collection("posture_alerts").insertOne({
      userId: String(userId),
      message,
      severity,
      sentAt: new Date(),
      expoResult,
    });

    res.json({ status: "success", expoResult });
  } catch (error) {
    console.error("[push] notify-posture error:", error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/login", express.json(), async (req, res) => {
  try {
    const { loginId, password } = req.body;
    await client.connect();
    const db = client.db("ergovision");

    // The Desktop Python app uses SHA-256 to hash passwords
    const passwordHash = crypto
      .createHash("sha256")
      .update(password)
      .digest("hex");

    const user = await db.collection("users").findOne({
      $or: [{ email: loginId }, { username: loginId }],
      password_hash: passwordHash,
    });

    if (user) {
      res.json({
        status: "success",
        user: {
          id: user._id,
          name: user.username,
          email: user.email,
        },
      });
    } else {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/api/dashboard", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res
        .status(400)
        .json({ status: "error", message: "Missing userId parameter" });
    }

    await client.connect();
    const db = client.db("ergovision");

    // Fetch the actual user data to replace hardcoded 'Alex'
    // Depending on python app, _id might be int, string, or ObjectId. Parsing accordingly.
    const { ObjectId } = require("mongodb");
    let queryId;
    try {
      queryId = new ObjectId(userId);
    } catch (e) {
      // Fallback if the Python app used custom string/int IDs instead of default Mongo ObjectIds
      queryId = userId;
    }

    const userDoc = await db.collection("users").findOne({ _id: queryId });
    const userName = userDoc ? userDoc.username || "User" : "User";
    const numericUserId = userDoc ? userDoc.id : null;

    // Get recent posture sessions for THIS SPECIFIC USER
    const postureSessions = await db
      .collection("posture_sessions")
      // checking string vs ObjectId vs numeric ID
      .find({
        $or: [
          { user_id: numericUserId },
          { user_id: userId },
          { user_id: queryId },
        ],
      })
      .sort({ session_date: -1 })
      .limit(7) // Get last 7 sessions
      .toArray();

    // Calculate averages and stats from DB
    let avgScore = 0;
    let totalScore = 0;
    let totalTrackedHours = 0;

    if (postureSessions.length > 0) {
      postureSessions.forEach((session) => {
        totalScore += session.score;
        totalTrackedHours += session.duration_minutes / 60;
      });
      avgScore = Math.round(totalScore / postureSessions.length);
    } else {
      avgScore = 0;
      totalTrackedHours = 0;
    }

    // Give 5 XP per minute tracked + 50 XP per session logged
    const calculatedXp =
      Math.round(totalTrackedHours * 60 * 5) + postureSessions.length * 50;
    const xpToNextLevel = 500 - (calculatedXp % 500);

    // Getting hydration logs (proxy for breaks) for THIS SPECIFIC USER
    const hydrationLogs = await db
      .collection("hydration_logs")
      .find({
        $or: [
          { user_id: numericUserId },
          { user_id: userId },
          { user_id: queryId },
        ],
      })
      .sort({ timestamp: -1 })
      .limit(38) // just grab a count
      .toArray();

    const breaksTaken = hydrationLogs.length;

    // Send dynamic db data
    res.json({
      status: "success",
      data: {
        userData: {
          name: userName,
          level: Math.floor(calculatedXp / 500) + 1,
          levelName:
            avgScore > 80 ? "Master" : avgScore > 60 ? "Pro" : "Beginner",
          xp: calculatedXp,
          xpToNext: xpToNextLevel,
          streak: postureSessions.length, // total sessions
        },
        postureScore: postureSessions.length > 0 ? postureSessions[0].score : 0, // Latest session score
        hoursTracked: Math.round(totalTrackedHours * 10) / 10,
        breaksTaken: breaksTaken,
        alerts: 0, // Need alerts collection logic if it exists
        thisWeek: {
          avgScore: avgScore,
          tracked: Math.round(totalTrackedHours * 10) / 10,
          improvement:
            postureSessions.length > 1 &&
            postureSessions[0].score > postureSessions[1].score
              ? "+5%"
              : "-2%",
        },
        chartData: {
          scores:
            postureSessions.length > 0
              ? postureSessions.map((s) => s.score).reverse()
              : [0, 0, 0, 0, 0, 0, 0],
          dates:
            postureSessions.length > 0
              ? postureSessions
                  .map((s) => {
                    const d = new Date(s.session_date);
                    const days = [
                      "Sun",
                      "Mon",
                      "Tue",
                      "Wed",
                      "Thu",
                      "Fri",
                      "Sat",
                    ];
                    return days[d.getDay()];
                  })
                  .reverse()
              : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Update the server.js to restart
process.on("SIGUSR2", () => {
  process.exit();
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(
    `ErgoVision Local API Server running on http://localhost:${PORT}`,
  );
});
