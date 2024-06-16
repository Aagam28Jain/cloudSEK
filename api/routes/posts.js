const express = require("express");

const router = express.Router({ mergeParams: true });
const postController = require("../controllers/postController");
const authController = require("../controllers/authControllers");

router.use(authController.protect);
router
  .route("/")
  .get(postController.getallPosts)
  .post(postController.setPostUserIds, postController.addPost);
router.route("/:Postid/comments").get(postController.getallCommentsonPost);
router
  .route("/:id")
  .get(postController.getPost)
  .delete(authController.protect, postController.deletePost)
  .patch(authController.protect,postController.updatePost);

module.exports = router;
