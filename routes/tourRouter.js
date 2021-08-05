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
  resizeTourImages,
} = require("../controllers/tourController");

const { protect, restrictTo } = require("../controllers/authController");
const reviewRouter = require("../routes/reviewRouter");

const multer = require("multer");

const multerFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new AppError("Not an image! Please upload just images."), false);
  }
};
const multerStorage = multer.memoryStorage();
const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

const uploadTourImages = upload.fields([
  { name: "imageCover", maxCount: 1 },
  { name: "images", maxCount: 3 },
]);

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
  .patch(uploadTourImages, resizeTourImages, update)
  .delete(protect, restrictTo("admin", "lead-guide"), deleteTour);

// //Tour reviews routers
// tourRouter
//   .route("/:tourId/reviews")
//   .post(protect, restrictTo("user"), createReview);

module.exports = tourRouter;
