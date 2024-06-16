const Comment = require("../models/commentModel");
const factory = require("./handlerFactory");

const catchAsync = require("../utils/catchAsync");

exports.getallComments = factory.getAll(Comment);

exports.setCommentUserIds = (req, res, next) => {
  if (!req.body.post) req.body.post = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;

  next();
};
exports.getComment = factory.getOne(Comment);
exports.addComment = factory.createComment(Comment);
exports.deleteComment = factory.deleteOne(Comment);
exports.updateComment = factory.updateOne(Comment);
