const mongoose = require("mongoose");
//For some reason, importing the model is not working properly.Temp fix applied using mongoose.model direct call

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

//Indexes
// Setting unique options to avoid duplicate reviews from the same user on the same tour
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

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

  if (stats.length > 0) {
    await mongoose.model("Tour").findByIdAndUpdate(tourId, {
      ratingsQuantity: stats[0].nRating,
      ratingsAverage: stats[0].avgRating,
    });
  } else {
    await mongoose.model("Tour").findByIdAndUpdate(tourId, {
      ratingsQuantity: 0,
      ratingsAverage: 4.5,
    });
  }
};

reviewSchema.post("save", function () {
  //This needs to points out to the current tour
  // Review.calcAverage() would not work because the schema is not created at this point
  // So this.construct can be used instead.
  this.constructor.calcAverageRatings(this.tour);
});

//pre middleware is required because this is the only way we could access and query documents before
//updating it
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.reviewDoc = await this.findOne();
  next();
});

//Then, after getting the exact document, it's possible to use the static function on reviewDoc constructor
reviewSchema.post(/^findOneAnd/, async function () {
  await this.reviewDoc.constructor.calcAverageRatings(this.reviewDoc.tour);
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
