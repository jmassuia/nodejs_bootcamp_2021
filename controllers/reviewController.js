const Review = require(".././models/reviewSchema");
const catchAsync = require(".././utils/catchAsync");
const AppError = require(".././utils/errorHandler");

exports.index = catchAsync(async (req, res, next) => {
  const reviews = await Review.find();
  // .populate({ path: "tour" })
  // .populate({ path: "user" });

  res.status(200).json({
    status: "Successful",
    results: reviews.length,
    data: reviews,
  });
  next();
});

exports.create = catchAsync(async (req, res, next) => {
  //Receiving data from body
  const data = req.body;
  //Saving new Review
  await Review.create(data);
  //Response
  res.status(201).json({
    status: "Successful",
  });
  next();
});
