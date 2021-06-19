const mongoose = require("mongoose");

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
  this.populate({ path: "tour", select: "name" }).populate({
    path: "user",
    select: "name photo",
  });
  next();
});

const Review = new mongoose.model("Review", reviewSchema);

module.exports = Review;
