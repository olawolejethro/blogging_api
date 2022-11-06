const express = require("express");
const passport = require("passport");
const bodyparser = require("body-parser");
const auth_router = require("./Routes/authRouter");
const blogRouter = require("./Routes/blogRouter");
const userRouter = require("./Routes/userRouter");
require("dotenv").config;

const app = express();
app.use(bodyparser.json());
//INITIALIZING PASSPORT
app.use(passport.initialize());
require("./passport");

//routes
app.use("/", auth_router);
app.use("/blogs", blogRouter);
app.use("/users", userRouter);
app.get("/", (req, res) => {
  res.send("welcome to homepage");
});

//Error handling middleware
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message.message || "server error!!!!!";
  return res.status(status).json({ status: "somthing broke", message });
});

module.exports = app;
