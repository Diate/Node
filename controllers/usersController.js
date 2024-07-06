const User = require('./../models/userModel');
const APIfeatures = require('./../utils/APIfeatures');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const authController = require('./authController');
const factory = require('./handlerFactory');

const filterObj = (obj, ...objFilter) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (objFilter.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUser = factory.GetAll(User);

exports.getUser = factory.GetOne(User);

exports.createUser = factory.CreateOne(User);

exports.deleteUser = factory.DeleteOne(User);

exports.updateUser = factory.UpdateOne(User);

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

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
