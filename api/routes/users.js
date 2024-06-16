const express = require("express");
const authController = require("../controllers/authControllers");
const userController = require("../controllers/userControllers");

const router = express.Router();

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.get("/posts/:id", userController.getallPostsbyuser);
router.get("/comments/:id", userController.getallcommentsbyuser);


module.exports = router;
