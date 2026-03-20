const authMiddleware = require("../middleware/authMiddleware");
const express = require("express");
const router = express.Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking
} = require("../controllers/bookingController");

router.post("/",
authMiddleware,
createBooking);

router.get("/",
authMiddleware,
getAllBookings);

router.get("/:id",
authMiddleware,
getBookingById);

router.put("/:id",
authMiddleware,
updateBooking);

router.delete("/:id",
authMiddleware,
deleteBooking);

module.exports = router;