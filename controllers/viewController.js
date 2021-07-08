const Tour = require("../models/tourSchema");
const catchAsync = require("../utils/catchAsync");

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

exports.getTour = catchAsync(async (req, res) => {
  // 1)  Get data from the tours, also including the guides and the reviews
  const slug = req.params.slug;
  const tour = await Tour.findOne({ slug: `${slug}` });

  // 2) Build the template using the data got in step 1
  // 3) Render data
  res.status(200).render("tour", {
    title: tour.name,
    tour,
  });
});
