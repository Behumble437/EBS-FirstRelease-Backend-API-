const eventRoutes = require("./routes/eventRoutes");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/events", eventRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Event Booking System Backend API is running" });
});

app.get("/api/test", (req, res) => {
  res.json({
    success: true,
    message: "Test API is working"
  });
});
const bookingRoutes = require("./routes/bookingRoutes");
// ...
app.use("/api/bookings", bookingRoutes); 

module.exports = app;