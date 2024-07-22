const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');

exports.getOverview = catchAsync(async (req, res) => {
  tours = await Tour.find();
  res.status(200).render('overview', {
    title: 'All tours',
  });
});
exports.getTour = catchAsync(async (req, res) => {
  tour = await Tour.findOne({ slug: req.params.slug });
  res.status(200).render('tour', {
    title: 'All tours',
  });
});
