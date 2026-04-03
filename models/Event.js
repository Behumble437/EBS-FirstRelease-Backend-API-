const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    location: {
      type: String,
      required: true
    },
    capacity: { type: Number, required: false, default: 0 },
    pricePerTicket: {
      type: Number,
      required: true,
      min: 0,
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Event", eventSchema);