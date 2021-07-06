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
  getTourWithin,
  getDistances,
} = require("../controllers/tourController");

const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRouter");

tourRouter.use("/:tourId/reviews", reviewRouter);

// //middle function used to check if the data exists
// tourRouter.param('id', checkId);
tourRouter.route("/top-5-cheap").get(aliasTopTours, index);

tourRouter.route("/tour-stats").get(getToursStats);
tourRouter
  .route("/monthly-plan/:year")
  .get(protect, restrictTo("admin", "lead-guide", "guide"), getMonthlyPlan);

//Geospacial queries
tourRouter
  .route("/tour-within/:distance/center/:latlng/unit/:unit")
  .get(getTourWithin);
//tour-whitin/45/center/-45,32/unit/km

tourRouter.route("/distances/:latlng/unit/:unit").get(getDistances);

tourRouter
  .route("/")
  .get(index)
  .post(protect, restrictTo("admin", "lead-guide"), create);

tourRouter
  .route("/:id")
  .get(find)
  .patch(update)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// //Tour reviews routers
// tourRouter
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview);

module.exports = tourRouter;
