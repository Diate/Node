const AppError = require('../utils/appError');

const handleCastErrorDb = (err) => {
  const msg = `Invalid ${err.path}:${err.value}.`;
  return new AppError(msg, 400);
};

const handleDuplicateFieldsrDb = (err) => {
  const regex = /\b(\w+)\s*:\s*"([^"]*)"/g;
  console.log();
  let msg = err.errorResponse.errmsg.match(regex);
  const message = `Duplicate field value: '${msg}'. Please use another value`;
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
  const token = '';

  const cookieOption = {
    expires: new Date(Date.now() + 10000000 * 24 * 60 * 60 * 1000),

    httpOnly: true,
    secure: true,
  };
  res.cookie('jwt', token, cookieOption);
  res.status(err.statusCode).json({
    status: err.status,
    token,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrPro = (err, res) => {
  const token = '';

  const cookieOption = {
    expires: new Date(Date.now() + 10000000 * 24 * 60 * 60 * 1000),

    httpOnly: true,
    secure: true,
  };
  res.cookie('jwt', token, cookieOption);
  if (err.isOperational) {
    // send error define by dev to client
    res.status(err.statusCode).json({
      status: err.status,
      token,
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

const handleJWTError = () => {
  return new AppError('Invalid token. Please log in again!', 401);
};

const handleJWTExpiredError = () => {
  return new AppError('The token is expired, Please log in again!', 401);
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';
  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV.trim() === 'production') {
    let error = { ...err };
    error.message = err.message;
    if (err.name === 'CastError') {
      error = handleCastErrorDb(error);
    }

    if (err.code === 11000) {
      error = handleDuplicateFieldsrDb(error);
    }
    if (err.name === 'ValidationError') {
      error = handleValidatorErrorDb(error);
    }
    if (err.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (err.name === 'TokenExpiredError') {
      error = handleJWTExpiredError();
    }
    sendErrPro(error, res);
  }
};
