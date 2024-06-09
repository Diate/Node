const express = require('express');
const tourRoute = require('./routes/toursRoute');
const userRoute = require('./routes/usersRoute');
const morgan = require('morgan');

const app = express();

app.use(express.json());
app.use(morgan('dev'));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});
app.use(express.static('./public'));
app.use('/api/v1/tours', tourRoute);
app.use('/api/v1/users', userRoute);

module.exports = app;
