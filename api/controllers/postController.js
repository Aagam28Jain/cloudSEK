const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const factory = require("./handlerFactory");

exports.getallPosts = factory.getAll(Post);

exports.setPostUserIds = (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  next();
};
exports.getPost = factory.getOne(Post);
exports.addPost = factory.createOne(Post);
exports.deletePost = factory.deleteOne(Post);
exports.updatePost = factory.updateOne(Post);
exports.getallCommentsonPost = factory.getAllComments(Comment);
