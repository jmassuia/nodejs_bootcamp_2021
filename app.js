const express = require('express');
const morgan = require('morgan');
const path = require('path');

const ErrorHandler = require('./utils/errorHandler');
const globalErrorHandler = require('./controllers/errorController');

const tourRoutes = require('./routes/tourRouter');
const userRoutes = require('./routes/userRouter');

const app = express();

//Middleware structure in the middleware cycle

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));

  // app.use((req, res, next) => {
  //   //Adding req property
  //   req.requestTime = new Date().toISOString();
  //   console.log('Hello from the middleware cycle');
  //   next();
  // });
}

//middlewares

app.use(express.json());

//Serving Static Variables;
app.use(express.static(path.resolve(__dirname, 'public')));

app.use('/api/v1/tours', tourRoutes);
app.use('/api/v1/users', userRoutes);

//Router handler - For routes that doesn't exists
app.all('*', (req, res, next) => {
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
