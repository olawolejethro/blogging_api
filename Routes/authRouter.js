const express = require("express");
const userValidation = require("../validators/userValidation");
const authController = require("../controller/authController");
const auth_router = express.Router();
// SIGNUP ROUTE
auth_router.post("/signup", userValidation, authController.signup);

// SIGNIN ROUTE
auth_router.post("/signin", userValidation, authController.signin);
module.exports = auth_router;
