const Review = require(".././models/reviewSchema");
const catchAsync = require(".././utils/catchAsync");
const AppError = require(".././utils/errorHandler");
const factory = require(".././controllers/handlerFactor");

exports.index = catchAsync(async (req, res, next) => {
  let filter = {};
  //Filtering in case a specific tour is passed in the route
  if (req.params.tourId) filter = { tour: req.params.tourId };

  const reviews = await Review.find(filter);
  // .populate({ path: "tour" })
  // .populate({ path: "user" });

  return res.status(200).json({
    status: "Successful",
    results: reviews.length,
    data: reviews,
  });
  next();
});

exports.setTourUserId = (req, res, next) => {
  //Getting tour and user ids in case they are not passed into req.body
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = req.user.id; //from protect middleware
  next();
};

//Get review
exports.getReview = factory.getOne(Review);
//Create reviews
exports.createReview = factory.createOne(Review);
//Update reviews
exports.updateReview = factory.updateOne(Review);
//Delete reviews
exports.deleteReview = factory.deleteOne(Review);
