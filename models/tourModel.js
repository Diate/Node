const mongoose = require('mongoose');
const tourSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A tour must have name'],
    trim: true,
    unique: true,
  },
  duration: {
    type: Number,
    required: [true, 'A tour must have duration'],
  },
  maxGroupSize: {
    type: Number,
    required: [true, 'A tour must have max group size'],
  },
  difficulty: {
    type: String,
    required: [true, 'A tour must have difficulty'],
  },
  ratingAverage: {
    type: Number,
    default: 4.5,
  },
  ratingQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A tour must have price'],
  },
  priceDiscount: {
    type: Number,
  },
  summary: {
    type: String,
    trim: true,
    required: [true, 'A tour must have summery'],
  },
  description: {
    type: String,
    trim: true,
    required: [true, 'A tour must have description'],
  },
  imageCover: {
    type: String,
    required: [true, 'A tour must have image cover'],
  },
  images: {
    type: [String],
  },
  createAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
  startDates: {
    type: [Date],
    required: [true, 'A tour must have start dates'],
  },
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
