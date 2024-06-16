const Post = require("../models/postModel");
const Comment = require("../models/commentModel");
const factory = require("./handlerFactory");

exports.getallPostsbyuser = factory.getAllbyUser(Post);
exports.getallcommentsbyuser =  factory.getAllbyUser(Comment);