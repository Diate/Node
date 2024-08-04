const AppError = require('../utils/appError');

const handleCastErrorDb = (err) => {
  const msg = `Invalid ${err.path}:${err.value}.`;
  return new AppError(msg, 400);
};

const handleDuplicateFieldsrDb = (err) => {
  const regex = /\b(\w+)\s*:\s*"([^"]*)"/g;
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

const sendErrDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    // API
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
  } else {
    // RENDERED WEBSITE
    console.log('ERROR:', err);
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong',
      msg: err.message,
    });
  }
};

const sendErrPro = (err, req, res) => {
  console.log(req.originalUrl);
  if (req.originalUrl.startsWith('/api')) {
    // API
    const token = '';

    const cookieOption = {
      expires: new Date(Date.now() + 10000000 * 24 * 60 * 60 * 1000),

      httpOnly: true,
      secure: true,
    };
    res.cookie('jwt', token, cookieOption);
    if (err.isOperational) {
      // send error define by dev to client
      return res.status(err.statusCode).json({
        status: err.status,
        token,
        message: err.message,
      });
    }
    // } else {
    //   // don't send error system or another anonymus cause for client
    //   console.log('ERROR:', err);
    //   return res.status(500).json({
    //     status: err.status,
    //     message: 'Something went wrong!',
    //   });
    // }
  }
  console.log('ERROR:', err);
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again',
  });
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
    sendErrDev(err, req, res);
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
    sendErrPro(error, req, res);
  }
};
