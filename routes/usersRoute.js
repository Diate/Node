const express = require('express');
const userController = require('./../controllers/usersController');
const userRoute = express.Router();
userRoute
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

userRoute
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);
module.exports = userRoute;
