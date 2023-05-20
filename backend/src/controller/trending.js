const Comment = require("../models/comment");
const Story = require("../models/story");
const User = require("../models/user");
const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");
const ObjectId = mongoose.Types.ObjectId;

const getTrendingStories = asyncHandler(async (req, res) => {
  const docsPerPage = parseInt(req.query.limit) || 10;
  const currentPage = parseInt(req.query.page) || 0;

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
    { $sort: { upvoteCount: -1, commentCount: -1, _id: 1 } },
    { $skip: docsPerPage * currentPage },
    { $limit: docsPerPage },
    {
      $lookup: {
        from: "users",
        pipeline: [{ $project: { username: 1, _id: 0, profilepic: 1 } }],
        localField: "userId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
  ]);
  return res.status(200).json({ stories });
});

const getEngagementStories = asyncHandler(async (req, res, next) => {
  const docsPerPage = parseInt(req.query.limit) || 10;
  const currentPage = parseInt(req.query.page) || 0;
  const userId = req.user;
  const commentedStoryId = await Comment.aggregate([
    { $match: { userId: new ObjectId(userId) } },
    { $project: { _id: "$storyId" } },
  ]);
  const mappedIds = commentedStoryId.map((obj) => new ObjectId(obj._id));
  const stories = await Story.aggregate([
    {
      $match: {
        $or: [
          { "downvotes.user": new ObjectId(userId) },
          { "upvotes.user": new ObjectId(userId) },
          { _id: { $in: mappedIds } },
          {
            $and: [
              {
                $or: [
                  {
                    $expr: {
                      $gt: [{ $size: { $ifNull: ["$comments", []] } }, 0],
                    },
                  },
                  {
                    $expr: {
                      $gt: [{ $size: { $ifNull: ["$upvotes", []] } }, 0],
                    },
                  },
                  {
                    $expr: {
                      $gt: [{ $size: { $ifNull: ["$downvotes", []] } }, 0],
                    },
                  },
                ],
              },
              { userId: new ObjectId(userId) },
            ],
          },
        ],
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
        upvotes: 0,
        downvotes: 0,
        comments: 0,
      },
    },
    { $skip: docsPerPage * currentPage },
    { $limit: docsPerPage },
    {
      $lookup: {
        from: "users",
        pipeline: [{ $project: { username: 1, _id: 0, profilepic: 1 } }],
        localField: "userId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
  ]);
  res.status(200).json({ stories });
});
const getLeaderboard = asyncHandler(async (req, res) => {
  const docsPerPage = parseInt(req.query.limit) || 10;
  const currentPage = parseInt(req.query.page) || 0;
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
    { $sort: { totalStories: -1, totalUpvotes: -1, _id: 1 } },
    { $skip: docsPerPage * currentPage },
    { $limit: docsPerPage },
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
  let sortBy = req.query.sort;
  let sortAccepedVal = new Set(["upvoteCount", "downvoteCount", "createdAt"]);
  if (!sortAccepedVal.has(sortBy)) {
    sortBy = "createdAt";
  }
  const docsPerPage = parseInt(req.query.limit) || 10;
  const currentPage = parseInt(req.query.page) || 0;
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
          { $sort: { [sortBy]: -1, commentCount: -1, _id: 1 } },
          { $skip: docsPerPage * currentPage },
          { $limit: docsPerPage },
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
              createdAt: 1,
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
        as: "author",
      },
    },
    { $unwind: "$story" },
    { $unwind: "$author" },
    { $replaceRoot: { newRoot: { $mergeObjects: ["$$ROOT", "$story"] } } },
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
      },
    },
  ]);
  return res.status(200).json({ stories });
});
const getAllUserStories = asyncHandler(async (req, res) => {
  const userId = req.user;
  let sortBy = req.query.sort;
  let sortAccepedVal = new Set(["upvoteCount", "downvoteCount", "createdAt"]);
  if (!sortAccepedVal.has(sortBy)) {
    sortBy = "createdAt";
  }
  const docsPerPage = parseInt(req.query.limit) || 10;
  const currentPage = parseInt(req.query.page) || 0;
  const stories = await Story.aggregate([
    { $match: { userId: new ObjectId(userId) } },
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
    { $sort: { [sortBy]: -1, commentCount: -1, _id: 1 } },
    { $skip: docsPerPage * currentPage },
    { $limit: docsPerPage },
    {
      $lookup: {
        from: "users",
        pipeline: [{ $project: { username: 1, _id: 0, profilepic: 1 } }],
        localField: "userId",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
  ]);
  return res.status(200).json({ stories });
});

module.exports = {
  getTrendingStories,
  getEngagementStories,
  getLeaderboard,
  getTimelineStories,
  getAllUserStories,
};
