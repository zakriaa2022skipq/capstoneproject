const { string } = require("joi");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    trim: true,
  },
  username: {
    type: String,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    trim: true,
  },
  profilepic: {
    type: String,
    default: null,
  },
  following: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
      },
    ],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
