const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/errorHandler");

//Generate json web token using user._id and a secret key.
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//Signup function
exports.signup = catchAsync(async (req, res, next) => {
  //Descontructing the request body in other to get just the require infos
  const user = req.body;

  //Creating user
  const newUser = await User.create(user);

  //Getting jwt for newUser
  const token = signToken(newUser._id);

  res.status(201).json({
    status: "Success!",
    token,
    data: {
      user: newUser,
    },
  });
});

//Login function
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and passord exists
  if (!email || !password) {
    return next(new AppError("No valid email and/or password", 400));
  }

  //Check if the credentials are correct
  const user = await User.findOne({ email }).select("+password");

  //Checking if the password inputed by the user is correct using methods in the user Schema
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect E-mail or password"), 401);
  }
  //If everything is ok, send the token
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check if it's there
  let token;

  const bearerToken = req.headers.authorization.split(" ");

  //Validating if the token was beared
  if (req.headers.authorization && bearerToken[0] === "Bearer") {
    token = bearerToken[1];
  }

  if (!token) {
    return next(
      new AppError("You are not logged in! Please login to get access", 401)
    );
  }
  // 2) Token validation
  //                              function    Calling the function
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exits
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        "The user belonging to this token does not exists anymore",
        401
      )
    );
  }
  // 4) If user changed passwords after the token was issued
  if (freshUser.passwordChanged(decoded.iat)) {
    return next(
      new AppError(
        "You recently changed the password! Please, login again!",
        401
      )
    );
  }

  //GRANT Access to protected route
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(res.user.role))
      return next(
        new AppError("You do not have enough access to perform this!", 403)
      );
  };
};
