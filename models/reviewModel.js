const mongoose = require('mongoose');
reviewSchema = mongoose.Schema(
  {
    review: {
      type: String,
      required: [true, 'Review can not be empty'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [0, 'The rating must above than 0'],
      max: [5, 'The rating must small than 5'],
    },
    createAt: {
      type: Date,
      default: Date.now(),
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to the tour.'],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to the user.'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
    },
  }
);

reviewSchema.pre(/^find/, function (next) {
  this.select('-__v');
  this.populate([
    { path: 'tour', select: '-__v -secret' },
    { path: 'user', select: '-__v' },
  ]);
  next();
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
