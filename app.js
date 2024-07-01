const express = require('express');
const morgan = require('morgan');
const rateLimits = require('express-rate-limit');
const helmet = require('helmet');
const mongosanity = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const tourRoute = require('./routes/toursRoute');
const userRoute = require('./routes/usersRoute');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');

const app = express();
app.use(helmet());
app.use(express.json());
// app.use(morgan('dev'));
const limits = rateLimits({
  windowMs: 60 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again in 15 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use('/api/', limits);

// Data sanitization against NoSQL query injection
app.use(mongosanity());
// Data sanitization against XSS
app.use(xss());
// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'maxGroupSize',
      'difficulty',
      'ratingAverage',
      'ratingQuantity',
      'price',
    ],
  })
);

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);
module.exports = app;
