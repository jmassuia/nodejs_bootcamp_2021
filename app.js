const express = require("express");
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");

//Security packages
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const cors = require("cors");

const ErrorHandler = require("./utils/errorHandler");
const globalErrorHandler = require("./controllers/errorController");

const tourRoutes = require("./routes/tourRouter");
const userRoutes = require("./routes/userRouter");
const reviewRoutes = require("./routes/reviewRouter");
const viewRoutes = require("./routes/viewRouter");

const app = express();

app.use(cors());
//Setting up the server-side view engine
app.set("view engine", "pug");
app.set("views", path.resolve(__dirname, "views"));

// Serving Static Variables
app.use(express.static(path.resolve(__dirname, "public")));
//Middleware structure in the middleware cycle

//Set security HTTP headers
app.use(helmet());

//Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));

  // app.use((req, res, next) => {
  //   //Adding req property
  //   req.requestTime = new Date().toISOString();
  //   console.log('Hello from the middleware cycle');
  //   next();
  // });
}

//Middlewares

//Limit rate mw
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try it out one hour later",
});

app.use("/api", limiter);

// Body parser, reading the data that comes in from req.body.
app.use(
  express.json({
    limit: "10kb",
  })
);

//Enabling HTML parser coming from submited request.
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

app.use(cookieParser());

// Data satization agains NOSQL query injection
app.use(mongoSanitize());

// Data sanatization agains XSS
app.use(xss());

app.use("/", viewRoutes);
app.use("/api/v1/tours", tourRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/reviews", reviewRoutes);

//Router handler - For routes that doesn't exists
app.all("*", (req, res, next) => {
  next(new ErrorHandler(`Cannot find ${req.originalUrl} on this server`, 404));
  // res.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find ${req.originalUrl} on server`,
  // });
  // next();

  // //Creating an internal Error
  // const err = new Error(`Cannot find ${req.originalUrl} on this request`);
  // err.status = 'Fail';
  // err.statusCode = 404;

  // next(err);
});

app.use(globalErrorHandler);

module.exports = app;
