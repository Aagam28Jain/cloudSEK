const mongoose = require("mongoose");
const Comment = require("./commentModel");

const postSchema = new mongoose.Schema(
  {
    post: {
      type: String,
      required: [true, "please provide text for Post"],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "A Post must belong to a User"],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);



const Post = mongoose.model("Post", postSchema);

module.exports = Post;
