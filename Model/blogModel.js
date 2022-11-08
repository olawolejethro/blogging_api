const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.ObjectId;
const blogSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    trim: true,
  },

  author: {
    type: ObjectId,
    ref: "user",
  },

  state: {
    type: String,
    enum: ["published", "draft"],
    default: "draft",
  },

  read_count: {
    type: Number,
    default: 0,
  },

  reading_time: { type: String },

  tags: [String],

  body: {
    type: String,
    trim: true,
    required: [true, "you blog must have a body"],
  },
  timestamp: {
    type: Date,
    default: Date.now(),
  },
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
