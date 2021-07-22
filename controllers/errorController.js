const AppError = require("../utils/errorHandler");

const sendDevError = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      err: err,
      stack: err.stack,
      message: err.message,
    });
  }
  //Rendered Website
  return res.status(err.statusCode).render("error", {
    title: "Something went wrong!",
    msg: err.message,
  });
};

const sendProdError = (err, req, res) => {
  //API
  if (req.originalUrl.startsWith("/api")) {
    //Operational, trusted errors
    if (err.isOperational) {
      return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: err.message,
      });

      //Programming unknown errors, don't leak to the client
    } else {
      return res.status(err.statusCode).render("error", {
        title: "Something went wrong!",
        msg: "Please, contact Support and try again later",
      });
    }
  }
  //Rendered Webpage
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });

    //Programming unknown errors, don't leak to the client
  } else {
    console.log("ERROR", err);

    return res.status(500).json({
      message: "Something went very wrong",
    });
  }
};

const handleJWTError = (err) => {
  return new AppError("Invalid token, please login again", 401);
};

const handleJWTExpire = (err) => {
  return new AppError("JWT expired, please log in again!!", 401);
};

module.exports = (err, req, res, next) => {
  //If not defined, 500 is default
  err.statusCode = err.statusCode || 500;

  //If not defined, error is default
  err.status = err.status || "error";
  if (process.env.NODE_ENV === "development") {
    sendDevError(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    let error = { ...err };

    if (error.name === "JsonWebTokenError") error = handleJWTError(error);
    if (error.name === "TokenExpiredError") error = handleJWTExpire(error);
    sendProdError(error, res);
  }

  // //response
  // res.status(err.statusCode).json({
  //   status: err.status,
  //   message: err.message,
  // });
  next();
};
