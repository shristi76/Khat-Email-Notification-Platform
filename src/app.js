const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const notificationRoutes = require("./routes/notificationRoutes");

const app = express();

const allowedOrigins = process.env.CLIENT_URL
    ? process.env.CLIENT_URL.split(",").map((origin) => origin.trim())
    : true;

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.json({
        message: "Notification API Running 🚀"
    });
});

app.get("/health", async (req, res) => {
    try {
        await require("./config/db").query("SELECT 1");
        res.json({ status: "ok", timestamp: new Date().toISOString() });
    } catch (error) {
        res.status(503).json({ status: "unavailable" });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((req, res) => res.status(404).json({ message: "Route not found" }));

app.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "An unexpected server error occurred" });
});

module.exports = app;
