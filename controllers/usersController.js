const User = require('./../models/userModel');
const APIfeatures = require('./../utils/APIfeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const authController = require('./authController');

const filterObj = (obj, ...objFilter) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (objFilter.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

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

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { active: false },
    {
      runValidators: false,
    }
  );
  res.status(200).json({
    status: 'success',
    message: 'Delete user successfully',
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
