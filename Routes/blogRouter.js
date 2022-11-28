const express = require("express");
const passport = require("passport");
const blogValidation = require("../validators/blogValidators");
const blogController = require("../controller/blogController");

const blogRouter = express.Router();

blogRouter.get("/", blogController.getAllBlogs);
blogRouter.get(
  "/owner",
  passport.authenticate("jwt", { session: false }),
  blogController.ownerBlog
);
blogRouter.get("/:blogId", blogController.getBlogById);

blogRouter.post(
  "/",
  blogValidation,
  passport.authenticate("jwt", { session: false }),
  blogController.postBlog
);
blogRouter.patch(
  "/:blogId",
  passport.authenticate("jwt", { session: false }),
  blogController.updateBlog
);
blogRouter.delete(
  "/:blogId",
  passport.authenticate("jwt", { session: false }),
  blogController.deleteblog
);

module.exports = blogRouter;
