const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');
const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have name'],
      trim: true,
      unique: true,
      minlength: [10, 'The name must have more or equal 10 character'],
      maxlength: [50, 'The name must have less or equal 50 character'],
      // validate: [validator.isAlpha, 'The name is only contain letter'],
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
      validate: {
        validator: function (val) {
          // this only work with create method not word with update (evenif have validator : true)
          return val < this.price;
        },
        message: 'The discount {VALUE} is must low than the regular price',
      },
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
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        emun: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    location: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: {
      virtuals: true,
    },
  }
);
tourSchema.index({ price: 1, ratingAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.virtual('durationWeeks').get(function () {
  return this.duration / 7;
});

tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id',
});
tourSchema.pre('save', function (next) {
  // only work with save and create not work with update
  this.slug = slugify(toString(this.name), { lower: true });
  next();
});

// tourSchema.pre('save', async function (next) {
//   // only work with save and create not work with update
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

tourSchema.pre(/^find/, function (next) {
  this.where({ secret: { $ne: true } });
  next();
});
tourSchema.pre(/^find/, function (next) {
  this.populate((path = 'guides'), (select = '-__v'));
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  next();
});
tourSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secret: { $ne: true } } });
  next();
});
const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
