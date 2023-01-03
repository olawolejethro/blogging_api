const express = require("express");
const userValidation = require("../validators/userValidation");
const authController = require("../controller/authController");
const auth_router = express.Router();
// SIGNUP ROUTE
auth_router.post("/signup", userValidation, authController.signup);

// SIGNIN ROUTE
auth_router.post("/signin", userValidation, authController.signin);
auth_router.post("/forgotPassword", authController.forgetPassword);
auth_router.patch("/resetPassword/:token", authController.resetPassword);
module.exports = auth_router;
