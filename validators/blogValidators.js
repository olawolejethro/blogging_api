const joi = require("joi");
joi.ObjectId = require("joi-objectid")(joi);

const blogValidationMiddleware = async (req, res, next) => {
  try {
    await blogSchema.validateAsync(req.body);
    next();
  } catch (error) {
    return res.status(406).send(error.details[0].message);
  }
};
const blogSchema = joi.object({
  title: joi.string().min(3).max(20).required(),
  description: joi.string().min(10).max(200).optional().trim(),
  // author: joi.objectId().ref("user"),
  state: joi.array().has(["published,draft"]).default("draft"),
  read_count: joi.number().default(0),
  reading_time: joi.string(),
  tags: joi.string(),
  body: joi.string().trim().required(),
  timestamp: joi.date().default(Date.now),
});

module.exports = blogValidationMiddleware;
