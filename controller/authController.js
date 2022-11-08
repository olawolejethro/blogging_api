const jwt = require("jsonwebtoken");

const userModel = require("../Model/userModel");
require("dotenv").config();

const secret = process.env.JWT_SECRET;

const signToken = (user) => {
  //this function will be called any time i need to sign users data or details
  return jwt.sign({ user }, secret, {
    expiresIn: process.env.EXPIRATION_TIME,
  });
};

// SIGNUP CONTROLLER ROUTE
exports.signup = async function (req, res, next) {
  try {
    const { email, first_name, last_name, password } = req.body;
    const user = await userModel.create({
      email,
      first_name,
      last_name,
      password,
    });
    user.password = undefined;
    const token = signToken(user);
    return res.json({
      message: "Signup successfull",
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// SIGIN CONTROLLER ROUTE

exports.signin = async function (req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      const error = new Error("Username or password is incorrect");
      return next(error);
    }
    // check if user exist && password is correct

    const user = await userModel.findOne({ email });
    if (!user || !(await user.correctPassword(password, user.password))) {
      const error = new Error("Incorrect email or password");
      return next(error);
    }

    // if all conditions are passed then send token
    user.password = undefined;
    const token = signToken(user);
    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    return next(error, { message: "user login unsuccessful" });
  }
};
