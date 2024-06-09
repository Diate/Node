const express = require('express');
const tourController = require('./../controllers/toursController');
const tourRoute = express.Router();

tourRoute
  .route('/top-5-cheaps')
  .get(tourController.top5cheap, tourController.getAlltours);
tourRoute
  .route('/')
  .get(tourController.getAlltours)
  .post(tourController.createTour);

tourRoute
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = tourRoute;
