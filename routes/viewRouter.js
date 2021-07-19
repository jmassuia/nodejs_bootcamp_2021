const viewRouter = require("express").Router();

const {
  getOverview,
  getTour,
  login,
} = require("../controllers/viewController");

const { protect, isLoggedIn } = require("../controllers/authController");

// viewRouter.get("/", (req, res) => {
//   res.status(200).render("base", {
//     tour: "Test local variable",
//     user: "Joao Vitor Massuia",
//   });
// });

viewRouter.use(isLoggedIn);

viewRouter.get("/overview", getOverview);

viewRouter.get("/tour/:slug", protect, getTour);

viewRouter.get("/login", login);

module.exports = viewRouter;
