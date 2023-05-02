const Comment = require("../models/comment");
const Story = require("../models/story");
const User = require("../models/user");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ObjectId = mongoose.Types.ObjectId;

const getTrendingStories = asyncHandler(async (req, res) => {
  const stories = await Story.aggregate([
    { $match: { isPublic: true } },
    {
      $addFields: {
        commentCount: { $size: { $ifNull: ["$comments", []] } },
        upvoteCount: { $size: { $ifNull: ["$upvotes", []] } },
        downvoteCount: { $size: { $ifNull: ["$downvotes", []] } },
      },
    },
    {
      $project: {
        upvotes: 0,
        downvotes: 0,
        comments: 0,
      },
    },
    { $sort: { upvoteCount: -1, commentCount: -1 } },
  ]);
  return res.status(200).json({ stories });
});

const getEngagementStories = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  const commentedStoryId = await Comment.aggregate([
    { $match: { userId: new ObjectId(userId) } },
    { $project: { _id: "$storyId" } },
  ]);
  const story = await Story.find({
    $or: [
      { "upvotes.user": userId },
      { "downvotes.user": userId },
      { _id: { $in: commentedStoryId } },
      {
        $and: [
          {
            $or: [
              {
                $expr: { $gt: [{ $size: { $ifNull: ["$comments", []] } }, 0] },
              },
              { $expr: { $gt: [{ $size: { $ifNull: ["$upvotes", []] } }, 0] } },
              {
                $expr: { $gt: [{ $size: { $ifNull: ["$downvotes", []] } }, 0] },
              },
            ],
          },
          { userId },
        ],
      },
    ],
  });
  res.status(200).json({ story });
});
const getLeaderboard = asyncHandler(async (req, res) => {
  const leaders = await Story.aggregate([
    {
      $addFields: {
        upvoteCount: { $size: { $ifNull: ["$upvotes", []] } },
      },
    },
    {
      $group: {
        _id: "$userId",
        totalStories: { $sum: 1 },
        totalUpvotes: { $sum: "$upvoteCount" },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$user" },
    {
      $project: {
        totalStories: 1,
        totalUpvotes: 1,
        "user.name": 1,
        "user.profilepic": 1,
        "user.username": 1,
        _id: 0,
      },
    },
  ]);
  return res.status(200).json({ leaders });
});

const getTimelineStories = asyncHandler(async (req, res) => {
  const userId = req.user;
  const stories = await User.aggregate([
    {
      $match: {
        _id: new ObjectId(userId),
      },
    },
    {
      $lookup: {
        from: "stories",
        pipeline: [
          {
            $match: {
              isPublic: true,
            },
          },
          {
            $addFields: {
              commentCount: { $size: { $ifNull: ["$comments", []] } },
              upvoteCount: { $size: { $ifNull: ["$upvotes", []] } },
              downvoteCount: { $size: { $ifNull: ["$downvotes", []] } },
            },
          },
          {
            $project: {
              video: 1,
              image: 1,
              text: 1,
              isPublic: 1,
              userId: 1,
              commentCount: 1,
              upvoteCount: 1,
              downvoteCount: 1,
            },
          },
        ],
        localField: "following.user",
        foreignField: "userId",
        as: "story",
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "story.userId",
        foreignField: "_id",
        as: "user",
      },
    },
    { $unwind: "$story" },
    {
      $project: {
        story: 1,
        "user.name": 1,
        "user.username": 1,
        "user.profilepic": 1,
      },
    },
  ]);
  return res.status(200).json({ stories });
});

module.exports = {
  getTrendingStories,
  getEngagementStories,
  getLeaderboard,
  getTimelineStories,
};
