const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const followUser = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  const username = req.params.username;
  const userDetail = await User.findOne({ username });
  if (userDetail == null) {
    req.statusCode = 400;
    throw new Error("User not found");
  }
  if (userDetail._id == userId) {
    req.statusCode = 400;
    throw new Error("Unable to add follow");
  }
  const followUserId = userDetail._id;
  const user = await User.updateOne(
    { _id: userId, "user.following": { $ne: followUserId } },
    {
      $addToSet: { following: { user: followUserId } },
    }
  );
  return res.status(201).json({ msg: "follow added" });
});
const unfollowUser = asyncHandler(async (req, res) => {
  const userId = req.user;
  const username = req.params.username;
  const userDetail = await User.findOne({ username });
  if (userDetail == null) {
    req.statusCode = 400;
    throw new Error("User not found");
  }
  if (userDetail._id == userId) {
    req.statusCode = 400;
    throw new Error("Unable to remove follow");
  }
  const followUserId = userDetail._id;
  const user = await User.updateOne(
    { _id: userId },
    {
      $pull: { following: { user: followUserId } },
    }
  );
  return res.status(200).json({ msg: "follow removed" });
});

module.exports = { unfollowUser, followUser };
