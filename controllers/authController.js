const jwt = require("jsonwebtoken");

const User = require("../models/User");

const { JWT_SECRET, JWT_EXPIRES_IN } = require("../helpers/jwtConfig");

function formatUser(userDoc) {
  return {
    id: userDoc._id,
    name: userDoc.name,
    email: userDoc.email,
    role: userDoc.role,
  };
}

function getMissingFields(body, fields) {
  return fields.filter((f) => {
    const v = body?.[f];
    if (typeof v === "string") return v.trim().length === 0;
    return v === undefined || v === null;
  });
}

async function register(req, res) {
  try {
    const { name, email, password, role } = req.body || {};

    const missing = getMissingFields({ name, email, password }, [
      "name",
      "email",
      "password",
    ]);
    if (missing.length > 0) {
      return res
        .status(400)
        .json({ message: `Missing required fields: ${missing.join(", ")}` });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const user = await User.create({
      name: String(name).trim(),
      email: normalizedEmail,
      password: String(password),
      role: role === "admin" ? "admin" : "user",
    });

    return res.status(201).json({
      message: "Register successful",
      user: formatUser(user),
    });
  } catch (err) {
    if (err && err.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    return res.status(500).json({ message: "Server error" });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body || {};

    const missing = getMissingFields({ email, password }, ["email", "password"]);
    if (missing.length > 0) {
      return res.status(400).json({
        message: `Missing required fields: ${missing.join(", ")}`,
      });
    }

    const normalizedEmail = String(email).toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    return res.json({
      message: "Login successful",
      user: formatUser(user),
      token,
    });
  } catch (err) {
    if (err && err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
    return res.status(500).json({ message: "Server error" });
  }
}

module.exports = { register, login };

