const Review = require('../models/reviewModel');
const factory = require('./handlerFactory');

exports.setTourUserIds = (req, res, next) => {
  if (!req.body.tour) req.body.tour = req.params.tourid;
  if (!req.body.user) req.body.user = req.user.id;
  next();
};

exports.getAllreviews = factory.GetAll(Review);

exports.createReview = factory.CreateOne(Review);

exports.getReview = factory.GetOne(Review);

exports.deleteReview = factory.DeleteOne(Review);

exports.updateReview = factory.UpdateOne(Review);
