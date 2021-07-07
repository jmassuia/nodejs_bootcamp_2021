const viewRouter = require("express").Router();

const { getOverview, getTour } = require("../controllers/viewController");

// viewRouter.get("/", (req, res) => {
//   res.status(200).render("base", {
//     tour: "Test local variable",
//     user: "Joao Vitor Massuia",
//   });
// });

viewRouter.get("/overview", getOverview);

viewRouter.get("/tour/:slug", getTour);

module.exports = viewRouter;
