const express = require("express");
const { registerUser } = require("../controller/user");
const { registerUserSchema } = require("../validation/uservalidation");
const { uploadProfilePic } = require("../middleware/fileupload");
const { followUser, unfollowUser } = require("../controller/follow");

const router = express.Router();
router
  .route("/register")
  .post(
    uploadProfilePic.single("profilepic"),
    registerUserSchema,
    registerUser
  );

router.route("/:username/follow").post(followUser);
router.route("/:username/unfollow").post(unfollowUser);

module.exports = router;
