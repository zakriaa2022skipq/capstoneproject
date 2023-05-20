const express = require("express");
const passport = require("passport");
const { logoutUser, userDetail } = require("../controller/user");
const authMiddleware = require("../middleware/auth");
const { loginUserSchema } = require("../validation/uservalidation");

const router = express.Router();
router
  .route("/login")
  .post(loginUserSchema, passport.authenticate("local"), (req, res) =>
    res.status(200).json({ msg: "login successfull" })
  );

router.route("/logout").post(authMiddleware, logoutUser);
router.route("/me").get(authMiddleware, userDetail);
module.exports = router;
