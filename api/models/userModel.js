const crypto = require("crypto");
const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "A User must have a name"],
    unique: true,
    trim: true, //front or back mai extra space hata kr store krega
    maxlength: [40, "A name not longer than 40 letters"],
    minlength: [3, "A name  longer than 3 letters is required"],
  },
  email: {
    type: String,
    required: [true, "please write email"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "please provide a valid email"],
  },
  photo: { type: String },
  password: {
    type: String,
    require: [true, "please provide a password"],
    minlength: [8, "Password Must be atleast 8 character Long"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    require: [true, "please provide a confirm password"],
    validate: {
      // it will works on save and create  not update
      validator: function (el) {
        return el === this.password;
      },
      message: "password not matching",
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  // this field it to check if user is active on site or not
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});
userSchema.pre("save", async function (next) {
  // only run if password is modified or new user is created
  //here we have ensured one cannot change password by just updating the user
  // therefore password can only be changed by resetPassword
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  // yha pr 1000 isiliye kiya kyuki hmara token create jldi ho jata pr DB mai store hone mai tym lgta hai
  // hmne maan liya ek sec lgegea to 1000 milisec hata diya
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});
// isko hm ek instance bolte hai isko hm khi pr bhi User k instance  pr use kr skte no need for  import
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  // false means NOT changed
  return false;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
