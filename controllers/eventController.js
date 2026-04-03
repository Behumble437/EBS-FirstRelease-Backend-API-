const Event = require("../models/Event");

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ date: 1 });

    res.json({
      message: "Events fetched",
      events,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      title,
      date,
      location,
      description,
      capacity,
      pricePerTicket,
    } = req.body || {};

    const finalName = name || title;

    if (
      !finalName ||
      !date ||
      !location ||
      !description ||
      capacity === undefined ||
      pricePerTicket === undefined
    ) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      return res.status(400).json({
        message: "Invalid date",
      });
    }

    const finalCapacity = Number(capacity);
    const finalPricePerTicket = Number(pricePerTicket);

    if (Number.isNaN(finalCapacity) || finalCapacity < 1) {
      return res.status(400).json({
        message: "Capacity must be at least 1",
      });
    }

    if (Number.isNaN(finalPricePerTicket) || finalPricePerTicket < 0) {
      return res.status(400).json({
        message: "Price per ticket must be 0 or more",
      });
    }

    const event = await Event.create({
      name: String(finalName).trim(),
      date: parsedDate,
      location: String(location).trim(),
      description: String(description).trim(),
      capacity: finalCapacity,
      pricePerTicket: finalPricePerTicket,
    });

    res.status(201).json({
      message: "Event created",
      event,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.updateEvent = async (req, res) => {
  try {
    const {
      name,
      title,
      date,
      location,
      description,
      capacity,
      pricePerTicket,
    } = req.body || {};

    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    if (name || title) {
      event.name = String(name || title).trim();
    }

    if (date) {
      const parsedDate = new Date(date);
      if (Number.isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          message: "Invalid date",
        });
      }
      event.date = parsedDate;
    }

    if (location !== undefined) {
      event.location = String(location).trim();
    }

    if (description !== undefined) {
      event.description = String(description).trim();
    }

    if (capacity !== undefined) {
      const finalCapacity = Number(capacity);
      if (Number.isNaN(finalCapacity) || finalCapacity < 1) {
        return res.status(400).json({
          message: "Capacity must be at least 1",
        });
      }
      event.capacity = finalCapacity;
    }

    if (pricePerTicket !== undefined) {
      const finalPricePerTicket = Number(pricePerTicket);
      if (Number.isNaN(finalPricePerTicket) || finalPricePerTicket < 0) {
        return res.status(400).json({
          message: "Price per ticket must be 0 or more",
        });
      }
      event.pricePerTicket = finalPricePerTicket;
    }

    const updatedEvent = await event.save();

    res.json({
      message: "Event updated",
      event: updatedEvent,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const deletedEvent = await Event.findByIdAndDelete(req.params.id);

    if (!deletedEvent) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    res.json({
      message: "Event deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};