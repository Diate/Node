const AppError = require('../utils/appError');

const handleCastErrorDb = (err) => {
  const msg = `Invalid ${err.path}:${err.value}.`;
  return new AppError(msg, 400);
};

const handleDuplicateFieldsrDb = (err) => {
  const pattern = /\{ name: "([^"]+)" \}/;

  // let msg = err.message.match(pattern);
  const message = `Duplicate field value: '${err.keyValue.name}'. Please use another value`;
  return new AppError(message, 400);
};
const handleValidatorErrorDb = (err) => {
  // let msg = err.message.match(pattern);
  const error = Object.values(err.errors).map((el) => el.message);
  const message = `ValidatorError: '${error.join(
    '. '
  )}'. Please use another value`;
  return new AppError(message, 400);
};
const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrPro = (err, res) => {
  if (err.isOperational) {
    // send error define by dev to client
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    // don't send error system or another anonymus cause for client
    console.log('ERROR:', err);
    res.status(500).json({
      status: err.status,
      message: 'Something went wrong!',
    });
  }
};
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') {
      error = handleCastErrorDb(error);
    }

    if (err.code === 11000) {
      error = handleDuplicateFieldsrDb(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidatorErrorDb(error);
    }
    sendErrPro(error, res);
  }
};
