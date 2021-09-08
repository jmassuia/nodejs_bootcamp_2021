const bookingRouter = require("express").Router();
const {
  getCheckOutSession,
  createBooking,
  updateBooking,
  getBooking,
  getAllBookings,
  deleteBooking,
} = require("../controllers/bookingController");
const { protect, restrictTo } = require("../controllers/authController");

bookingRouter.use(protect);

bookingRouter.get("/checkout-session/:tourId", protect, getCheckOutSession);

// Restricted to admins and Lead-guides

bookingRouter.use(restrictTo("admin", "lead-guide"));
bookingRouter.route("/").get(getAllBookings).post(createBooking);

bookingRouter
  .route("/:id")
  .get(getBooking)
  .patch(updateBooking)
  .delete(deleteBooking);

module.exports = bookingRouter;
