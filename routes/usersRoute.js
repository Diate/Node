const express = require('express');
const userController = require('./../controllers/usersController');
const authController = require('./../controllers/authController');

const userRoute = express.Router();

userRoute.post('/signup', authController.signup);
userRoute.post('/signin', authController.signin);
userRoute.post('/forgotpassword', authController.forgotPassword);
userRoute.patch('/resetpassword/:token', authController.resetPassword);
userRoute.patch(
  '/updatePassword',
  authController.protect,
  authController.updatePassword
);
userRoute.patch('/updateMe', authController.protect, userController.updateMe);
userRoute.delete('/deleteMe', authController.protect, userController.deleteMe);
userRoute
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

userRoute
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(authController.restrictTo('admin'), userController.deleteUser);
module.exports = userRoute;
