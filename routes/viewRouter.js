const viewRouter = require("express").Router();

const {
  getOverview,
  getTour,
  login,
  account,
  getMyBookings,
  updateUserData,
  setPageHeaders,
} = require("../controllers/viewController");

const { protect, isLoggedIn } = require("../controllers/authController");
const { createBookingCheckout } = require("../controllers/bookingController");

// viewRouter.get("/", (req, res) => {
//   res.status(200).render("base", {
//     tour: "Test local variable",
//     user: "Joao Vitor Massuia",
//   });
// });

viewRouter.use(isLoggedIn);

viewRouter.get(
  "/",
  setPageHeaders,
  createBookingCheckout,
  isLoggedIn,
  getOverview
);

viewRouter.get("/tour/:slug", setPageHeaders, isLoggedIn, getTour);

viewRouter.get("/login", setPageHeaders, isLoggedIn, login);
viewRouter.get("/account", setPageHeaders, protect, account);
viewRouter.get("/my-bookings", setPageHeaders, protect, getMyBookings);

module.exports = viewRouter;
