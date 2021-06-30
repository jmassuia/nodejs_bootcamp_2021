const mongoose = require("mongoose");
const Schema = require("mongoose").Schema;
const User = require("../models/userSchema");
const Review = require("../models/reviewSchema");

const slugify = require("slugify");

const validator = require("validator");

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "A tour must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A tour name must have less or 40 chars"],
      minlength: [5, "A tour name must have at least 5 chars"],
    },
    duration: Number,
    maxGroupSize: Number,
    difficulty: {
      type: String,
      enum: {
        values: ["easy", "medium", "difficult"],
        message: "Difficulty is either easy, medium or difficult",
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, "A rating must be equal or greater than one"],
      max: [5, "A rating must be less or equal 5"],
    },
    ratingsQuantity: Number,
    price: Number,
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: "Discount price greater than the tour price",
      },
    },
    summary: String,
    slug: String,
    description: String,
    imageCover: String,
    images: [String],
    CreatedAt: {
      type: Date,
      default: Date.now(),
    },
    startDates: [Date],
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      //GeoJSON
      type: {
        type: String,
        default: "Point",
        enum: ["Point"],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    locations: [
      {
        type: {
          type: String,
          default: "Point",
          enum: ["Point"],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Simple index
// 1 = acendent -1 = descendant

// tourSchema.index({ price: 1 });

//Compound indexes
tourSchema.index({ price: 1, ratingsAverage: -1 });

//Virtual properties
tourSchema.virtual("durationWeeks").get(function () {
  return this.duration / 7;
});

tourSchema.virtual("reviews", {
  ref: "Review", //Refer to the Review schema
  localField: "_id", // Where tour id
  foreignField: "tour", // is equal to tour id on review schema
});

// Document middleware - pre: runs before save and create events
tourSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// //Embedding Guides into tours documents
// tourSchema.pre("save", async function (next) {
//   //This query will return a bunch of promises
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));

//   //This will get all the promises completed and storage then in the tour's guide property
//   this.guides = await Promise.all(guidesPromises);

//   next();
// });
// tourSchema.pre('save', function (next) {
//   console.log(this);
//   next();
// });

// //Document middleware - post: runs after save and create events
// tourSchema.post('save', function (doc, next) {
//   console.log(doc);
//   next();
// });

//Query middleware, using regular expressions for findOne, findOneAndDelete...
tourSchema.pre(/^find/, function (next) {
  this.find({ secretTour: { $ne: true } });

  this.startTime = Date.now();
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.populate({
    path: "guides",
    select: "-__v",
  });

  next();
});

// Query post middleware
tourSchema.post(/^find/, function (docs, next) {
  // console.log(Date.now() - this.startTime);
  next();
});

//Aggregation middleware
tourSchema.pre("aggregate", function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = new mongoose.model("Tour", tourSchema);

module.exports = Tour;
