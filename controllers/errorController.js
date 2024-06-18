const AppError = require('../utils/appError');

const handleCastErrorDb = (err) => {
  const msg = `Invalid ${err.path}:${err.value}.`;
  return new AppError(msg, 400);
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
  } else if (process.env.NODE_ENV === 'production') {
    console.log('fafasf');
    let error = { ...err };
    if (error.name === 'CastError') {
      error = handleCastErrorDb(error);
    }
    sendErrPro(error, res);
  }
};
