const Tour = require("../models/tourSchema");
const User = require("../models/userSchema");
const Booking = require("../models/bookingSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/errorHandler");

exports.setPageHeaders = (req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' *;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com  https://js.stripe.com/v3/  'self' blob: ;script-src-attr https://js.stripe.com/v3/ 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
  );
  next();
};

exports.getOverview = catchAsync(async (req, res) => {
  // 1) Get tour data from collection
  const tours = await Tour.find();

  // 2) Build template
  // 3 Render the template using tour data from first Step
  res.status(200).render("overview", {
    title: "All tours",
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  // 1)  Get data from the tours, also including the guides and the reviews
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug: `${slug}` });

  //In case there's no tour
  if (!tour) {
    next(new AppError("No tour with this name was found!", 404));
  }

  // 2) Build the template using the data got in step 1
  // 3) Render data
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.login = (req, res) => {
  // Rendering the page
  res.status(200).render("login", { title: "Log in" });
};

exports.account = (req, res) => {
  res.status(200).render("account", { title: "My profile" });
};

exports.getMyBookings = catchAsync(async (req, res) => {
  // 1) Find all the bookings
  const id = req.user.id;
  const bookings = await Booking.find({ user: id });

  // 2) Find tours with the reference IDs
  const tourIDs = bookings.map((el) => el.tour.id);
  const tours = await Tour.find({ _id: { $in: tourIDs } });

  res.status(200).render("overview", {
    title: "My bookings",
    tours,
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log(req.body);
  //Receiving data from the request body.
  const { name, email } = req.body;
  //update user data
  const user = await User.findByIdAndUpdate(
    req.user.id,
    {
      name,
      email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  return res.status(201).render("account", {
    title: "Your Account",
    user,
  });
});
