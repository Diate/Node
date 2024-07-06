const express = require('express');
const reviewController = require('./../controllers/reviewController');
const authController = require('../controllers/authController');
const reviewRoute = express.Router({ mergeParams: true });

reviewRoute.use(authController.protect);

reviewRoute
  .route('/')
  .get(reviewController.getAllreviews)
  .post(
    authController.restrictTo('user'),
    reviewController.setTourUserIds,
    reviewController.createReview
  );
reviewRoute
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview
  )
  .delete(reviewController.deleteReview);

module.exports = reviewRoute;
