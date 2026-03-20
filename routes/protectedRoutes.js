const express = require("express");

const User = require("../models/User");

const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

const router = express.Router();

router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("name email role");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.json({
      message: "Profile fetched",
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/admin-only", authMiddleware, requireRole("admin"), async (req, res) => {
  return res.json({
    message: "Admin access granted",
    user: req.user,
  });
});

module.exports = router;

