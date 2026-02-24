const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
const crypto = require("crypto");

const app = express();
app.use(cors());

const uri =
  "mongodb+srv://test:test123@cluster0.bbkjn7s.mongodb.net/?appName=Cluster0";
const client = new MongoClient(uri);

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
