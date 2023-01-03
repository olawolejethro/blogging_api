const jwt = require("jsonwebtoken");
const user = require("../Model/userModel");
const crypto = require("crypto");
const userModel = require("../Model/userModel");
const emailSender = require("../Utils/emailSender");
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
    const { email, first_name, last_name, password, confirmPassword } =
      req.body;

    if (password !== confirmPassword) {
      const error = new Error("password does not match");
      return next(error);
    }
    const user = await userModel.create({
      email,
      first_name,
      last_name,
      password,
      confirmPassword,
    });

    user.password = undefined;
    user.confirmPassword = undefined;
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

exports.forgetPassword = async (req, res, next) => {
  const { email } = req.body;
  const User = await user.findOne({ email });
  if (!User) return next(new Error("user can not be found"));
  try {
    const resetToken = User.genResetToken();
    console.log(resetToken);
    await User.save({ validateBeforeSave: false });
    const resetPasswordURL = `${req.protocol}://${req.get(
      "host"
    )}/resetPassword/${resetToken}`;
    const body = `Forgot your password? Submit a PATCH request with your new password and confirmPassword to: <a href=${resetPasswordURL}>${resetPasswordURL}</a>.\nIf you didn't forget your password, please ignore this email!`;
    const subject = "Your password reset token (valid for 10 min)";
    await emailSender({ email, body, subject });
    return res.status(200).json({
      status: "success",
      message: "A link to reset your password hs been sent to your email",
    });
  } catch (error) {
    User.paswordRestToken = undefined;
    User.passwordResetTokenExpiryTime = undefined;
    await User.save({ validateBeforeSave: false });
    console.log(error);
    return next(
      new Error(
        "Something went wrong while sending a passoword resent link to email. Please try again later"
      )
    );
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const token = req.params.token;
    console.log(token, "book");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    console.log(hashedToken);
    // /lloking for th user with the reset token
    const User = await user.findOne({
      paswordRestToken: hashedToken,
      passwordResetTokenExpiryTime: { $gt: Date.now() },
    });

    console.log(User);
    if (!User) {
      return next(
        new Error("password reset token is invalid please try again")
      );
    }
    const { password, confirmPassword } = req.body; // Reset the password
    User.password = password;
    User.confirmPassword = confirmPassword;
    // password reset token will be cleared after a succeful password update
    User.paswordRestToken = undefined;
    User.passwordResetTokenExpiryTime = undefined;
    await User.save({ validateModifiedOnly: true });
    User.password = undefined;
    User.passwordModifiedAt = undefined;
    const jwttoken = signToken(User);

    return res.status(200).json({ token: jwttoken, data: { User } });
  } catch (error) {
    return next(error);
  }
};
