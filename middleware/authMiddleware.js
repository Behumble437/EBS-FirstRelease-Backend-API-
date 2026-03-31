const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../helpers/jwtConfig");

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization || "";

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing or invalid Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = { userId: payload.userId, role: payload.role };
    return next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// aliases used in event/booking routes
const protect = authMiddleware;

const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === "admin") return next();
  return res.status(403).json({ message: "Access denied: admins only" });
};

module.exports = authMiddleware;
module.exports.protect = protect;
module.exports.adminOnly = adminOnly;
