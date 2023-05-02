const mongoose = require("mongoose");

const storySchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    video: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    text: {
      type: String,
      default: null,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    upvotes: {
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
    downvotes: {
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
    comments: {
      type: [
        {
          comment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: true,
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const story = mongoose.model("Story", storySchema);

module.exports = story;
