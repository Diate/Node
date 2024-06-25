const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const jwt = require('jsonwebtoken');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const { default: mongoose } = require('mongoose');
// const { use } = require('../app');

const authToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    ConfirmPassword: req.body.ConfirmPassword,
    PasswordChangeAt: req.body.PasswordChangeAt,
    role: req.body.role,
  });

  const token = authToken(newUser._id);

  res.status(201).json({
    status: 'success',
    token: token,
    data: {
      user: newUser,
    },
  });
});

exports.signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email or password!', 400));
  }
  const user = await User.findOne({ email }).select('+password');

  const iscorrect = await user.correctPassword(password, user.password);
  if (!user || !iscorrect) {
    return next(new AppError('Incorrect email or password!', 401));
  }

  const token = authToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const freshUser = await User.findById(decoded.id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }
  if (!freshUser.changePasswordAfter(decoded.iat)) {
    return next(
      new AppError('The password recently change, Please login again!', 401)
    );
  }
  req.user = freshUser;
  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      console.log(req.user.role);
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }
    next();
  };
};
