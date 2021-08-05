const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const catchAsync = require("../utils/catchAsync");
const AppError = require("./../utils/errorHandler");

const crypto = require("crypto");

const Email = require("../utils/nodemailer");

//Generate json web token using user._id and a secret key.
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

//Response function
const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    cookieOptions.secure = true;
  }

  //Setting JWT cookies
  res.cookie("jwt", token, cookieOptions);

  //Removing the password from the  body
  user.password = undefined;
  res.status(statusCode).json({
    status: "Success!",
    token,
    data: {
      user,
    },
  });
};

//Signup function
exports.signup = catchAsync(async (req, res, next) => {
  //Descontructing the request body in other to get just the require infos
  const user = req.body;

  //Creating user
  const newUser = await User.create(user);

  let url = `${req.protocol}://${req.get("host")}/account`;
  console.log(url);
  await new Email(newUser, url).sendWelcome();

  //Getting JWT for newUser and sending the response to the client
  createSendToken(newUser, 201, res);

  // //Getting jwt for newUser
  // const token = signToken(newUser._id);

  // res.status(201).json({
  //   status: "Success!",
  //   token,
  //   data: {
  //     user: newUser,
  //   },
  // });
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

  //Getting JWT for newUser and sending the response to the client
  createSendToken(user, 200, res);
  // //If everything is ok, send the token
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});

//Remove the cookies
exports.logout = catchAsync(async (req, res, next) => {
  //Reset the cookie
  res.cookie("jwt", "", {
    expires: new Date(Date.now() + 5000),
    httpOnly: true,
  });
  res.status(200).json({
    status: "Success!",
  });
});

// Only check if the user is logged or not. Valid for rendered pages
exports.isLoggedIn = async (req, res, next) => {
  let token;

  //Validating if the token was beared
  if (req.cookies.jwt) {
    token = req.cookies.jwt;

    // 2) Token validation
    //                              function    Calling the function
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) Check if user still exits
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
      return next();
    }
    // 4) If user changed passwords after the token was issued
    if (freshUser.passwordChanged(decoded.iat)) {
      return next();
    }

    //In case there's a logging user
    res.locals.user = freshUser;
  }
  next();
};

exports.protect = catchAsync(async (req, res, next) => {
  // 1) Get the token and check if it's there
  let token;

  // const bearerToken = req.headers.authorization.split(" ");

  //Validating if the token was beared
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
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

//Function that returns a middleware function in order to check the access level
//of the users requiring the resource
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role))
      return next(
        new AppError(
          "You do not have enough access to perform this action!",
          403
        )
      );

    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on POST e-mail

  //Get user email address
  const email = req.body.email;

  //Find user that match this e-mail address
  const user = await User.findOne({ email: email });

  //If the user does not exist, throw an error
  if (!user) {
    return next(
      new AppError("This e-mail does not exists on our database", 404)
    );
  }

  //2) Generate the random reset token

  const resetToken = user.createPasswordResetToken();

  // Save the variables modified in the schema without checking it again.
  await user.save({ validateBeforeSave: false });

  //3) Send the token to its e-mail
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password 
  and passwordConfirm to: \n${resetURL}\n, If you didn't forget your password, please disregard this email`;

  //Try catch block in order to get any error related to the service itself
  try {
    // await sendEmail({
    //   email: user.email,
    //   subject: "Reset your password (Valid for the next 10 mins)",
    //   message,
    // });

    res.status(200).json({
      status: "Success",
      message: "Token sent to your e-mail",
    });
  } catch (err) {
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        "There was an error when sending the e-mail. Try it later",
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  //1) Get user based on the token

  //Encrypting the token from the params
  const hashedToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  //Find a user that match the encrypted token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordTokenExpire: { $gt: Date.now() },
  });

  //2) If the token has not expired, and there's a user, set the password
  if (!user) {
    return next(
      new AppError(
        "No valid user was found with this token or the token has expired.\nPlease, try it again.",
        400
      )
    );
  }
  //3) Update the changedPassword property to the current user
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  await user.save();

  //4) Log the user in, JWT

  //Getting JWT for newUser and sending the response to the client
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
});

exports.updatePassword = async (req, res, next) => {
  //1 GET the user from collection
  const user = await User.findById(req.user._id).select("+password");

  //2 Check if the POSt password is correct

  if (
    !user ||
    !(await user.correctPassword(req.body.passwordCurrent, user.password))
  ) {
    return next(
      new AppError(
        "The password specified does not match, please try again",
        404
      )
    );
  }
  //3 if so, update the password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  //4 Log the user in, send JWT

  //Getting JWT for newUser and sending the response to the client
  createSendToken(user, 200, res);
  // const token = signToken(user._id);
  // res.status(200).json({
  //   status: "success",
  //   token,
  // });
};
