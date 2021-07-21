const viewRouter = require("express").Router();

const {
  getOverview,
  getTour,
  login,
} = require("../controllers/viewController");

const { isLoggedIn, logout } = require("../controllers/authController");

// viewRouter.get("/", (req, res) => {
//   res.status(200).render("base", {
//     tour: "Test local variable",
//     user: "Joao Vitor Massuia",
//   });
// });

viewRouter.use(isLoggedIn);

viewRouter.get("/", getOverview);

viewRouter.get("/tour/:slug", getTour);

viewRouter.get("/login", login);

module.exports = viewRouter;
