const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");
const eventController = require("../controllers/eventController");

router.get("/", eventController.getEvents);
router.get("/:id", eventController.getEventById);

router.post("/", authMiddleware, requireRole("admin"), eventController.createEvent);
router.put("/:id", authMiddleware, requireRole("admin"), eventController.updateEvent);
router.delete("/:id", authMiddleware, requireRole("admin"), eventController.deleteEvent);

module.exports = router;
