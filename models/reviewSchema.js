const mongoose = require("mongoose");
const Tour = require("./tourSchema");

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      trim: true,
      require: ["review needs to have a name!"],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    createAt: {
      type: Date,
      default: Date.now,
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: "Tour",
      required: ["A review must to belong to a tour"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: ["Review must belong to a user"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//model middlewares

//pre middlewares
reviewSchema.pre(/^find/, function (next) {
  // this.populate({ path: "tour", select: "_id name" }).populate({
  //   path: "user",
  //   select: "name photo",
  // });
  this.populate({
    path: "user",
    select: "name photo",
  });
  next();
});

reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: "$tour",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(stats);

  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};

reviewSchema.post("save", function () {
  //This needs to points out to the current tour
  // Review.calcAverage() would not work because the schema is not created at this point
  // So this.construct can be used instead.
  this.constructor.calcAverageRatings(this.tour);
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
