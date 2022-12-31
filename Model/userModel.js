const bcrypt = require("bcrypt");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
  // id: ObjectId,
  email: {
    type: String,
    lowercase: true,
    require: [true, " A user must have a email"],
    trim: true,
    unique: true,
  },

  first_name: {
    type: String,
    minLength: 2,
    require: true,
  },

  last_name: {
    type: String,
    minLength: 2,
    require: true,
  },

  password: {
    type: String,
    minLength: 2,
    require: true,
    trim: true,
    require: [true, "please input your password"],
  },
  confirmPassword: {
    type: String,
    minLength: 2,
    require: true,
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "password are not same",
    },
    trim: true,
    require: [true, "please input the correct  password"],
  },

  passwordModifiedAt: { type: Date },
  active: { type: Boolean, default: true, select: false },
  paswordRestToken: { type: String },
  passwordResetTokenExpiryTime: Date,

  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

userSchema.pre("save", async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  // Delete passwordConfirm field
  this.confirmPassword = undefined;
  next();
});

// pre hook to update the passwordModifiedAt field
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordModifiedAt = Date.now() - 1500;
  next();
});

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// checks if the password has been modified
userSchema.methods.passwordModified = function (jwt_iat) {
  if (!this.passwordModified) return false;
  const jwt_iat_ts = new Date(jwt_iat * 1000).toISOString();
  return new Date(jwt_iat_ts) < new Date(this.passwordModifiedAt);
};

/// genrating reset password token

userSchema.methods.genResetToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto.createHash("sah512").update(token).digest("hex");
  this.paswordRestToken = hashedToken;
  this.passwordResetTokenExpiryTime = Date.now() + 10 * 60 * 1000;
  return token;
};
const user = mongoose.model("user", userSchema);
module.exports = user;
