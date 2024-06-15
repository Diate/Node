const mongoose = require('mongoose');
const slugify = require('slugify');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      trim: true,
      unique: true,
      minlength: [10, 'The name must have more or equal 10 character'],
      maxlength: [50, 'The name must have less or equal 50 character'],
    },
    slug: {
      type: String,
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
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty must either : easy, medium or diffcult',
      },
    },
    ratingAverage: {
      type: Number,
      default: 4.5,
      min: [0, 'The rating must above than 0'],
      max: [5, 'The rating must small than 5'],
    },
    ratingQuantity: {
      type: Number,
      default: 0,
      min: [0, 'The rating must above than 0'],
      max: [5, 'The rating must small than 5'],
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
    secret: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
    },
  }
);

tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});
tourSchema.pre('save', function (next) {
  this.slug = slugify(toString(this.name), { lower: true });
  next();
});

tourSchema.pre(/^find/, function (next) {
  this.find({ secret: { $ne: true } });
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // this.find({ secret: { $ne: true } });
  // console.log(docs);
  next();
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
