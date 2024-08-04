const express = require('express');
const userController = require('./../controllers/usersController');
const authController = require('./../controllers/authController');

const userRoute = express.Router();

userRoute.post('/signup', authController.signup);
userRoute.post('/signin', authController.signin);
userRoute.get('/logout', authController.logout);
userRoute.post('/forgotpassword', authController.forgotPassword);
userRoute.patch('/resetpassword/:token', authController.resetPassword);

userRoute.use(authController.protect);

userRoute.get('/me', userController.getMe, userController.updateMe);
userRoute.patch(
  '/updatePassword',

  authController.updatePassword
);
userRoute.patch('/updateMe', userController.updateMe);
userRoute.delete('/deleteMe', userController.deleteMe);

userRoute.use(authController.restrictTo('admin'));
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
