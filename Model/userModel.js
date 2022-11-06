const bcrypt = require("bcrypt");
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

userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const user = mongoose.model("user", userSchema);
module.exports = user;
