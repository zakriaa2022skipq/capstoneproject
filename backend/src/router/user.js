const express = require("express");
const { registerUser, updateUser } = require("../controller/user");
const { registerUserSchema } = require("../validation/uservalidation");
const { uploadProfilePic } = require("../middleware/fileupload");
const {
  followUser,
  unfollowUser,
  getFollowingList,
} = require("../controller/follow");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
router
  .route("/register")
  .post(
    uploadProfilePic.single("profilepic"),
    registerUserSchema,
    registerUser
  );
router.route("/edit").patch(updateUser);

router.route("/:username/follow").post(authMiddleware, followUser);
router.route("/:username/unfollow").post(authMiddleware, unfollowUser);
router.route("/following/all").get(authMiddleware, getFollowingList);

module.exports = router;
