const { use } = require('bcrypt/promises');
const Tour = require('../models/tourModel');
const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res, next) => {
  tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours',
  });
});
exports.getTour = catchAsync(async (req, res, next) => {
  tour = await Tour.findOne({ slug: req.params.slug });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
  });
});

exports.getLoginForm = catchAsync(async (req, res, next) => {
  res.status(200).render('login', {
    title: 'Login to your account',
  });
});
exports.getAccount = catchAsync(async (req, res, next) => {
  res.status(200).render('account', {
    title: 'Your Account',
  });
});

exports.updateUserData = catchAsync(async (req, res, next) => {
  const updateduser = await User.findByIdAndUpdate(
    req.user.id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    { new: true, runValidators: true }
  );
  res.status(201).render('account', {
    title: 'Your Account',
    user: updateduser,
  });
});
