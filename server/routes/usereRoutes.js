const express = require("express");
const { registerUser, loginUser, getUserInfo, logoutUser } = require("../controllers/userController");
const { isAuthenticatedUser } = require("../middlewares/auth");
const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/user/me").get(isAuthenticatedUser, getUserInfo);
router.route("/user/logout").get(isAuthenticatedUser, logoutUser);


module.exports = router;
