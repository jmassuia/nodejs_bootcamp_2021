const reviewRouter = require("express").Router({ mergeParams: true });

const {
  index,
  createReview,
  getReview,
  updateReview,
  setTourUserId,
  deleteReview,
} = require(".././controllers/reviewController");
const { protect, restrictTo } = require("./../controllers/authController");

//Authentication middleware
reviewRouter.use(protect);

//List and create reviews
reviewRouter
  .route("/")
  .get(index) //List all the reviews
  .post(restrictTo("user"), setTourUserId, createReview); //Create a new review, procting and restricting it just for users

//Create review by tour
reviewRouter
  .route("/:tourId/reviews")
  .post(restrictTo("user"), setTourUserId, createReview);

//Update review
reviewRouter.route("/:id").get(getReview).patch(restrictTo("admin","user"),updateReview);

reviewRouter.route("/:id").delete(restrictTo("admin","user"),deleteReview);

module.exports = reviewRouter;
