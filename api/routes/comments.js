const express = require("express");

const router = express.Router({ mergeParams: true });
const commentController = require("../controllers/CommentController");
const authController = require("../controllers/authControllers");

router.use(authController.protect);
router.route("/").get(commentController.getallComments);

router
  .route("/:id")
  .get(commentController.getComment)
  .post(commentController.setCommentUserIds, commentController.addComment)
  .delete(commentController.deleteComment)
  .patch(commentController.updateComment);
module.exports = router;
