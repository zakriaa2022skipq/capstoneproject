const Story = require("../models/story");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;
const fs = require("fs").promises;
const path = require("path");
const Comment = require("../models/comment");

const createStory = asyncHandler(async (req, res) => {
  const { text, isPublic, color } = req.body;
  const userId = req.user;
  const story = { userId, isPublic };
  if (text) {
    story["text"] = text;
  }
  if (color) {
    story["style"] = { color };
  }
  if (req.files.video) {
    const video = req.files.video[0].filename;
    story["video"] = video;
    const createdStory = await Story.create(story);
    return res.status(201).json({ msg: "story created successfully" });
  }
  if (req.files.image) {
    const image = req.files.image[0].filename;
    story["image"] = image;
    const createdStory = await Story.create(story);
    return res.status(201).json({ msg: "story created successfully" });
  }
  const createdStory = await Story.create(story);
  return res.status(201).json({ msg: "story created successfully" });
});
const updateStory = asyncHandler(async (req, res) => {
  const { text, isPublic, color } = req.body;
  const userId = req.user;
  const storyId = req.params.storyId;
  const story = {};
  if (isPublic != undefined) {
    story["isPublic"] = isPublic;
  }
  if (text) {
    story["text"] = text;
  }
  if (color) {
    story["style"] = { color };
  }
  if (req.files?.video) {
    const video = req.files.video[0].filename;
    story["video"] = video;
    story["image"] = null;
  } else if (req.files?.image) {
    const image = req.files.image[0].filename;
    story["image"] = image;
    story["video"] = null;
  }
  const newStory = await Story.findOneAndUpdate(
    { userId, _id: storyId },
    story,
    { new: true }
  );
  return res.status(200).json({ msg: "updated story successfully" });
});
const deleteStory = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  const storyId = req.params.storyId;
  const story = await Story.findOneAndDelete({ userId, _id: storyId });
  if (story) {
    const comments = await Comment.deleteMany({ storyId: story._id });
    if (story.image) {
      try {
        const result = await fs.unlink(
          path.join(__dirname, `../public/story/${story.image}`)
        );
      } catch (error) {
        req.statusCode = 500;
        throw new Error("Error occured while trying to remvove file");
      }
    }
    if (story.video) {
      try {
        const result = await fs.unlink(
          path.join(__dirname, `../public/story/${story.video}`)
        );
      } catch (error) {
        console.log(error);
        req.statusCode = 500;
        throw new Error("Error occured while trying to remvove file");
      }
    }
    return res.status(200).json({ msg: "story deleted successfully" });
  }
  req.statusCode = 400;
  throw new Error("Story not found");
});

const storyDetail = asyncHandler(async (req, res) => {
  const userId = req.user;
  const storyId = req.params.storyId;
  const story = await Story.aggregate([
    {
      $match: {
        $or: [
          { isPublic: true, _id: new ObjectId(storyId) },
          { userId: new ObjectId(userId), _id: new ObjectId(storyId) },
        ],
      },
    },
    {
      $addFields: {
        commentCount: { $size: { $ifNull: ["$comments", []] } },
        upvoteCount: { $size: { $ifNull: ["$upvotes", []] } },
        downvoteCount: { $size: { $ifNull: ["$downvotes", []] } },
        hasUpvoted: {
          $in: [new ObjectId(userId), { $ifNull: ["$upvotes.user", []] }],
        },
        hasDownvoted: {
          $in: [new ObjectId(userId), { $ifNull: ["$downvotes.user", []] }],
        },
      },
    },
    {
      $project: {
        upvotes: 0,
        downvotes: 0,
        comments: 0,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    {
      $lookup: {
        from: "users",
        pipeline: [
          { $count: "totalUsers" },
          {
            $unwind: "$totalUsers",
          },
        ],
        as: "totalUsers",
      },
    },
    {
      $project: {
        "author.name": 1,
        "author.username": 1,
        "author.profilepic": 1,
        video: 1,
        image: 1,
        text: 1,
        isPublic: 1,
        createdAt: 1,
        updatedAt: 1,
        commentCount: 1,
        upvoteCount: 1,
        downvoteCount: 1,
        hasUpvoted: 1,
        hasDownvoted: 1,
        totalUsers: { $arrayElemAt: ["$totalUsers.totalUsers", 0] },
        style: 1,
      },
    },
  ]);
  if (story.length >= 1) {
    return res.status(200).json({ story });
  }
  req.statusCode = 400;
  throw new Error("Story not accessable");
});

module.exports = { createStory, updateStory, deleteStory, storyDetail };
