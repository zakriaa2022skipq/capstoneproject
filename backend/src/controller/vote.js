const Story = require("../models/story");
const asyncHandler = require("express-async-handler");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const upvoteStory = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  const storyId = req.params.storyId;
  const story = await Story.updateOne({ _id: storyId }, [
    {
      $set: {
        upvotes: {
          $cond: [
            { $in: [new ObjectId(userId), "$upvotes.user"] },
            {
              $filter: {
                input: "$upvotes",
                cond: { $ne: ["$$this.user", new ObjectId(userId)] },
              },
            },
            {
              $concatArrays: ["$upvotes", [{ user: new ObjectId(userId) }]],
            },
          ],
        },
        downvotes: {
          $filter: {
            input: "$downvotes",
            cond: { $ne: ["$$this.user", new ObjectId(userId)] },
          },
        },
      },
    },
  ]);

  return res.status(200).json({ msg: "upvoted successfully" });
});
const downvoteStory = asyncHandler(async (req, res) => {
  const userId = req.user;
  const storyId = req.params.storyId;
  const story = await Story.updateOne({ _id: storyId }, [
    {
      $set: {
        downvotes: {
          $cond: [
            { $in: [new ObjectId(userId), "$downvotes.user"] },
            {
              $filter: {
                input: "$downvotes",
                cond: { $ne: ["$$this.user", new ObjectId(userId)] },
              },
            },
            {
              $concatArrays: ["$downvotes", [{ user: new ObjectId(userId) }]],
            },
          ],
        },
        upvotes: {
          $filter: {
            input: "$upvotes",
            cond: { $ne: ["$$this.user", new ObjectId(userId)] },
          },
        },
      },
    },
  ]);
  return res.status(200).json({ msg: "downvoted successfully" });
});

module.exports = { downvoteStory, upvoteStory };
