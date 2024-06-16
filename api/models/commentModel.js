const mongoose = require("mongoose");
const User = require("./userModel");

const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: [true, "please provide a Comment"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    post: {
      type: mongoose.Schema.ObjectId,
      ref: "Post",
      required: [true, "A Comment must belong to a Post"],
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A comment must belong to a User"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
