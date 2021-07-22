const Tour = require("../models/tourSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/errorHandler");

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
  } else {
    //Setting CSP headers
    res.setHeader(
      "Content-Security-Policy",
      "default-src 'self' https://*.mapbox.com ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests;"
    );
  }

  // 2) Build the template using the data got in step 1
  // 3) Render data
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});

exports.login = async (req, res) => {
  // Rendering the page
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self' https://*.mapbox.com ws://localhost:*/ ;base-uri 'self';block-all-mixed-content;font-src 'self' https: data:;frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src https://cdnjs.cloudflare.com https://api.mapbox.com 'self' blob: ;script-src-attr * ;style-src *;upgrade-insecure-requests;"
  );
  res.status(200).render("login", { title: "Log in" });
};

exports.account = async (req, res) => {
  res.status(200).render("account", { title: "My profile" });
};
