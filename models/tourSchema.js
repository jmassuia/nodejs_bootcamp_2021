const mongoose = require('mongoose');
const Schema = require('mongoose').Schema;

const slugify = require('slugify');

const validator = require('validator');

const tourSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [40, 'A tour name must have less or 40 chars'],
      minlength: [5, 'A tour name must have at least 5 chars'],
    },
    duration: Number,
    maxGroupSize: Number,
    difficulty: {
      type: String,
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either easy, medium or difficult',
      },
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'A rating must be equal or greater than one'],
      max: [5, 'A rating must be less or equal 5'],
    },
    ratingsQuantity: Number,
    price: Number,
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (value) {
          return value < this.price;
        },
        message: 'Discount price greater than the tour price',
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Virtual properties
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

// Document middleware - pre: runs before save and create events
tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

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

//Query post middleware
// tourSchema.post(/^find/, function (docs, next) {
//   // console.log(Date.now() - this.startTime);
//   next();
// });

//Aggregation middleware
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
