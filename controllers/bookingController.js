const Tour = require("../models/tourSchema");
const Booking = require("../models/bookingSchema");
const factory = require(".././controllers/handlerFactor");
const AppError = require("./../utils/errorHandler");

const catchAsync = require("../utils/catchAsync");
const stripe = require("stripe")(process.env.STRIP_SECRET_KEY);

exports.getCheckOutSession = catchAsync(async (req, res, next) => {
  const id = req.params.tourId;
  // 1) Get the current booking tour
  const tour = await Tour.findById(id);

  // 2) Create checkout session
  const checkOutSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    success_url: `${req.protocol}://${req.get("host")}/?tour=${id}&user=${
      req.user.id
    }&price=${tour.price}`,
    cancel_url: `${req.protocol}://${req.get("host")}/tours/${tour.slug}`,
    customer_email: req.user.email,
    client_reference_id: req.params.tourID,
    line_items: [
      {
        name: `${tour.name} Tour`,
        description: `${tour.summary}`,
        images: [`http://localhost:8888/img/tours/${tour.imageCover}`],
        amount: tour.price * 100,
        currency: "usd",
        quantity: 1,
      },
    ],
  });
  // 3) Create session as response
  res.status(200).json({
    status: "success",
    checkOutSession,
  });

  next();
});

exports.createBookingCheckout = catchAsync(async (req, res, next) => {
  const { tour, user, price } = req.query;

  if (!tour && !user && !price) {
    return next();
  }
  await Booking.create({ tour, user, price });
  res.redirect(req.originalUrl.split("?")[0]);
  next();
});

exports.createBooking = factory.createOne(Booking);
exports.updateBooking = factory.updateOne(Booking);
exports.getBooking = factory.getOne(Booking);
exports.getAllBookings = factory.getAll(Booking);
exports.deleteBooking = factory.deleteOne(Booking);
