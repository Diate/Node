const User = require('./../models/userModel');
const APIfeatures = require('./../utils/APIfeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
exports.getAllUser = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Route not define',
  });
};
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Route not define',
  });
};
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Route not define',
  });
};
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Route not define',
  });
};
