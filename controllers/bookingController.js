const Booking = require("../models/Booking");
const Event = require("../models/Event");

const isAdmin = (user) => {
  return user && user.role === "admin";
};

const createBooking = async (req, res) => {
  const { eventId, ticketsBooked } = req.body;

  if (!eventId || !ticketsBooked) {
    return res.status(400).json({
      message: "Please provide eventId and ticketsBooked",
    });
  }

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({
        message: "Event not found",
      });
    }

    const finalTicketsBooked = Number(ticketsBooked);

    if (Number.isNaN(finalTicketsBooked) || finalTicketsBooked < 1) {
      return res.status(400).json({
        message: "ticketsBooked must be at least 1",
      });
    }

    const finalPricePerTicket = Number(event.pricePerTicket || 0);
    const totalPrice = finalTicketsBooked * finalPricePerTicket;

    const booking = await Booking.create({
      user: req.user.userId,
      event: eventId,
      ticketsBooked: finalTicketsBooked,
      pricePerTicket: finalPricePerTicket,
      totalPrice,
    });

    const populatedBooking = await Booking.findById(booking._id).populate(
      "event",
      "name date location pricePerTicket"
    );

    res.status(201).json({
      message: "Booking created",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getAllBookings = async (req, res) => {
  try {
    let query = {};

    if (!isAdmin(req.user)) {
      query.user = req.user.userId;
    }

    const bookings = await Booking.find(query).populate(
      "event",
      "name date location pricePerTicket"
    );

    res.json(bookings);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate(
      "event",
      "name date location pricePerTicket"
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const isOwner = booking.user.toString() === req.user.userId;

    if (!isOwner && !isAdmin(req.user)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const updateBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("event");

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const isOwner = booking.user.toString() === req.user.userId;

    if (!isOwner && !isAdmin(req.user)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    if (req.body.ticketsBooked !== undefined) {
      const finalTicketsBooked = Number(req.body.ticketsBooked);

      if (Number.isNaN(finalTicketsBooked) || finalTicketsBooked < 1) {
        return res.status(400).json({
          message: "ticketsBooked must be at least 1",
        });
      }

      booking.ticketsBooked = finalTicketsBooked;
      booking.pricePerTicket = Number(booking.event.pricePerTicket || 0);
      booking.totalPrice = booking.ticketsBooked * booking.pricePerTicket;
    }

    if (req.body.status) {
      booking.status = req.body.status;
    }

    if (req.body.paymentStatus) {
      booking.paymentStatus = req.body.paymentStatus;
    }

    const updatedBooking = await booking.save();

    const populatedBooking = await Booking.findById(updatedBooking._id).populate(
      "event",
      "name date location pricePerTicket"
    );

    res.json({
      message: "Booking updated",
      booking: populatedBooking,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const isOwner = booking.user.toString() === req.user.userId;

    if (!isOwner && !isAdmin(req.user)) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await Booking.findByIdAndDelete(req.params.id);

    res.json({
      message: "Booking deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
};