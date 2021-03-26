const tourRouter = require("express").Router();
const {
  index,
  find,
  aliasTopTours,
  getToursStats,
  getMonthlyPlan,
  create,
  update,
  deleteTour,
} = require("../controllers/tourController");

const { protect, restrictTo } = require("../controllers/authController");

// //middle function used to check if the data exists
// tourRouter.param('id', checkId);
tourRouter.route("/top-5-cheap").get(aliasTopTours, index);

tourRouter.route("/tour-stats").get(getToursStats);
tourRouter.route("/monthly-plan/:year").get(getMonthlyPlan);
tourRouter.route("/").get(protect, index).post(create);

tourRouter
  .route("/:id")
  .get(find)
  .patch(update)
  .delete(protect, restrictTo, deleteTour);

module.exports = tourRouter;
