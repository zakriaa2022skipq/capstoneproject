const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { hashPassword } = require("../util/password");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, username } = req.body;
  const userExists = await User.findOne({ username });
  if (userExists) {
    req.statusCode = 400;
    throw new Error("User with this username already exists");
  }
  const hashedPassword = await hashPassword(password);
  let profilepic = null;
  if (req.file) {
    profilepic = req.file.filename;
  }
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    username,
    profilepic,
  });
  return res.status(201).json({ msg: "user registered successfully" });
});

const logoutUser = asyncHandler(async (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      return next(err);
    }
    return res.status(200).json({ message: "logged out successfully" });
  });
});
const userDetail = asyncHandler(async (req, res) => {
  const userDetail = await User.findById(req.user).select([
    "-password",
    "-following",
  ]);
  return res.status(200).json({ userDetail });
});

module.exports = { registerUser, logoutUser, userDetail };
