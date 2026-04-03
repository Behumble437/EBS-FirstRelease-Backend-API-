const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api", protectedRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Event Booking System Backend API is running" });
});

app.get("/api/test", (req, res) => {
  res.json({ success: true, message: "Test API is working" });
});

module.exports = app;
