const express = require('express');
const tourController = require('./../controllers/toursController');
const tourRoute = express.Router();
const authController = require('../controllers/authController');

tourRoute
  .route('/top-5-cheaps')
  .get(tourController.aliastopTour, tourController.getAlltours);

tourRoute.route('/getTourStats').get(tourController.getTourStats);
tourRoute.route('/get-monthly-plan/:year').get(tourController.getMonthlyPlan);

tourRoute
  .route('/')
  .get(authController.protect, tourController.getAlltours)
  .post(tourController.createTour);

tourRoute
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
  );

module.exports = tourRoute;
