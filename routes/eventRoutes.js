const express = require("express");
const router = express.Router();
const Event = require("../models/Event");
const authMiddleware = require("../middleware/authMiddleware");
const { requireRole } = require("../middleware/roleMiddleware");

router.get("/", async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.json({
      message: "Events fetched",
      events,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:id", authMiddleware, requireRole("admin"),
async (req,res)=>{
  try {
    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(updatedEvent);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.delete("/:id", authMiddleware, requireRole("admin"),
async (req,res)=>{
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", authMiddleware, requireRole("admin"), async (req, res) => {
  try {
    const { name, date, location, description, title } = req.body || {};
    const finalName = name || title;

    if (!finalName || !date || !location || !description) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({ message: "Invalid date" });
    }

    const event = await Event.create({
      name: String(finalName).trim(),
      date: parsedDate,
      location: String(location).trim(),
      description: String(description).trim(),
    });

    res.status(201).json({ message: "Event created", event });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;