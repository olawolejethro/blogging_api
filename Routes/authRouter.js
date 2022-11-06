const express = require("express");

const authController = require("../controller/authController");
const auth_router = express.Router();
// SIGNUP ROUTE
auth_router.post("/signup", authController.signup);

// LOGIN ROUTE
auth_router.post("/signin", authController.signin);
module.exports = auth_router;
