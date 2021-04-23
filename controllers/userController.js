const User = require("../models/userSchema");
const catchAsync = require("../utils/catchAsync");

const AppError = require("../utils/errorHandler");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};

  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });

  return newObj;
};

exports.getAllUsers = catchAsync(async (req, res, next) => {
  //Get all users that are active
  const users = await User.find();

  return res.status(200).json({
    status: "Successful",
    data: {
      users,
    },
  });
});

//Update the current authenticated user
exports.updateMyData = catchAsync(async (req, res, next) => {
  //1 Create an error if the user tries to POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password update. Please use updateMypassword!!",
        400
      )
    );
  }

  //2 Update the user document

  //Filtering the object, so we make sure that no futher property is being updated
  const filteredBody = filterObj(req.body, "name", "email");

  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "Success!",
    data: {
      user: updatedUser,
    },
  });
});

//Delete user
exports.deleteMe = catchAsync(async (req, res, next) => {
  //Only works for logged in user
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(200).json({
    status: "Success",
  });
});

exports.getUser = (req, res) => {
  return res.status(505).json({
    status: "Error",
    message: "Route is not defined yet!",
  });
};
exports.createUser = (req, res) => {
  return res.status(505).json({
    status: "Error",
    message: "Route is not defined yet!",
  });
};
exports.updateUser = (req, res) => {
  return res.status(505).json({
    status: "Error",
    message: "Route is not defined yet!",
  });
};
exports.deleteUser = (req, res) => {
  return res.status(505).json({
    status: "Error",
    message: "Route is not defined yet!",
  });
};
