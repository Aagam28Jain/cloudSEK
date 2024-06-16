const crypto = require("crypto");
const { promisify } = require("util");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const User=require('../models/userModel')

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expiresIn: new Date(
      Date.now() + process.env.JWT_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true, // it means cookie can only be send on encrypted connection
    httpOnly: true,
  };
  cookieOptions.secure = true;
  res.cookie("jwt", token, cookieOptions);
  user.password = undefined;
  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // check if user has provided both email and password
  if (!email || !password) {
    return next(new AppError("please write email and password carefully", 400));
  }

  //check if user exists and password is correct
  // for security purpose we have implemented that even if someone req full details of a person password
  // wont be provided in find function you need to  manually select password in such situation
  const user = await User.findOne({ email }).select("+password");

  // we do not specify weather email is incorrect or password is incorrect vrna attacker ko pata chal jayega kya galat daal rha vo
  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("INCORRECT EMAIL OR PASSWORD", 401));
  }
  createSendToken(user, 200, res);
});

exports.protect = catchAsync(async (req, res, next) => {
  //1) Getting token and checking if its still valid

  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(
      new AppError("you are not logged in! please log in to get access"),
      401
    );
  }

  //2) verification token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  //3) check if user still exists
  //yha pr hm ye check kr rhe ki esa to nhi hai ki user ko token mil gya lekin kisi karan usne id delete krdi ho ya admin
  //ne delete kri ho to fir usko access mhi dena hai
  const freshUser = await User.findById(decoded.id);

  if (!freshUser) {
    return next(new AppError("The User does not exist now", 401));
  }

  //4)ye ho skta hai ki mene token generate kiya mera token kisi paas chala gya
  // mene socha password change krdu taki vo access na kr paaye
  // to hm yhi implement krenge if password changed after token is issued then do not login
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError("User recently changed password!please log in again.", 401)
    );
  }
  req.user = freshUser;
  next();
});
