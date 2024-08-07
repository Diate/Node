const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, 'Must have name'],
    minlength: [3, 'The name must have more or equal 3 character'],
    maxlength: [50, 'The name must have less or equal 50 character'],
  },
  email: {
    type: String,
    require: [true, 'Must have email address'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email'],
  },
  photo: {
    type: String,
  },
  role: {
    type: String,
    required: [true, 'A user must have role'],
    default: 'user',
    enum: {
      values: ['user', 'guide', 'lead-guide', 'admin'],
      message: 'Role must either : user, guide, lead-guide or admin',
    },
  },
  password: {
    type: String,
    require: [true, 'Must have password'],
    minlength: [6, 'The name password have more or equal 6 character'],
    maxlength: [25, 'The name password have less or equal 25 character'],
    select: false,
  },
  ConfirmPassword: {
    type: String,
    require: [true, 'Must have confirm password'],
    validate: {
      validator: function (val) {
        // this only work with create method not word with update (evenif have validator : true)
        return val === this.password;
      },
      message: 'The confirm password {VALUE} is must same the password',
    },
  },
  PasswordChangeAt: {
    type: Date,
    select: false,
  },
  PasswordResetToken: {
    type: String,
  },
  PasswordResetExpries: {
    type: Date,
  },
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) {
    next();
  }
  this.PasswordChangeAt = Date.now() - 1000;
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  this.ConfirmPassword = undefined;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

// userSchema.post('find', function (docs, next) {
//   console.log(docs);
//   docs.forEach((doc) => {
//     doc.password = undefined;
//     doc.ConfirmPassword = undefined;
//     doc.PasswordChangeAt = undefined;
//     doc.active = undefined;
//   });
//   next();
// });

userSchema.methods.correctPassword = async function (
  signinPassword,
  DBPassword
) {
  return await bcrypt.compare(signinPassword, DBPassword);
};

userSchema.methods.changePasswordAfter = async function (JWTTimeStamp) {
  let changeTimeStamp = 0;
  if (this.PasswordChangeAt) {
    changeTimeStamp = parseInt(this.PasswordChangeAt.getTime() / 1000, 10);
  }
  return changeTimeStamp < JWTTimeStamp;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.PasswordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.PasswordResetExpries = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
