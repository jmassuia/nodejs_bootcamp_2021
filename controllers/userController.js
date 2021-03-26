const User = require('../models/userSchema');
const catchAsync = require('../utils/catchAsync');

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  return res.status(200).json({
    status: 'Successful',
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  return res.status(505).json({
    status: 'Error',
    message: 'Route is not defined yet!',
  });
};
exports.createUser = (req, res) => {
  return res.status(505).json({
    status: 'Error',
    message: 'Route is not defined yet!',
  });
};
exports.updateUser = (req, res) => {
  return res.status(505).json({
    status: 'Error',
    message: 'Route is not defined yet!',
  });
};
exports.deleteUser = (req, res) => {
  return res.status(505).json({
    status: 'Error',
    message: 'Route is not defined yet!',
  });
};
