const express = require('express');
const reviewController = require('./../controllers/reviewController');
const reviewRoute = express.Router();
const authController = require('../controllers/authController');

reviewRoute
  .route('/')
  .get(reviewController.getAllreviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = reviewRoute;
