const reviewRouter = require("express").Router();

const { index, create } = require(".././controllers/reviewController");
const { protect, restrictTo } = require("./../controllers/authController");

reviewRouter
  .route("/")
  .get(index) //List all the reviews
  .post(protect, restrictTo("user"), create); //Create a new review, procting and restricting it just for users

module.exports = reviewRouter;
