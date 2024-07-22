const mongoose = require('mongoose');
const Tour = require('./tourModel');
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
reviewSchema.index({ tour: 1, user: 1 }, { unique: true });

reviewSchema.pre(/^find/, function (next) {
  this.select('-__v');
  this.populate([
    // { path: 'tour', select: '-__v -secret' },
    { path: 'user', select: 'name photo' },
  ]);
  next();
});

reviewSchema.statics.calAveratings = async function (tourId) {
  const obj = await this.aggregate([
    {
      $match: { tour: tourId },
    },
    {
      $group: {
        _id: '$tour',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' },
      },
    },
    // {
    //   $set: {
    //     nRating: { $ceil: '$nRating' },
    //     avgRating: { $round: '$avgRating' },
    //   },
    // },
  ]);
  await Tour.findByIdAndUpdate(tourId, {
    ratingAverage: !obj ? obj[0].avgRating : 0,

    ratingQuantity: !obj ? obj[0].nRating : 0,
  });
};
// reviewSchema.pre('save', function (next) {
//   this.constructor.calAveratings(this.tour);
//   next();
// });
reviewSchema.post('save', function () {
  this.constructor.calAveratings(this.tour);
});
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.tid = await this.clone().findOne();
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.tid.constructor.calAveratings(this.tid.tour);
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;
