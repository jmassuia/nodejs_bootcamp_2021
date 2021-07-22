const viewRouter = require("express").Router();

const {
  getOverview,
  getTour,
  login,
  account,
} = require("../controllers/viewController");

const { protect, isLoggedIn } = require("../controllers/authController");

// viewRouter.get("/", (req, res) => {
//   res.status(200).render("base", {
//     tour: "Test local variable",
//     user: "Joao Vitor Massuia",
//   });
// });

viewRouter.use(isLoggedIn);

viewRouter.get("/", isLoggedIn, getOverview);

viewRouter.get("/tour/:slug", isLoggedIn, getTour);

viewRouter.get("/login", isLoggedIn, login);
viewRouter.get("/account", protect, account);

module.exports = viewRouter;
