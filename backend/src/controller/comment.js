const Story = require("../models/story");
const Comment = require("../models/comment");
const asyncHandler = require("express-async-handler");

const createComment = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  const storyId = req.params.storyId;
  const { text } = req.body;
  const comment = await Comment.create({
    userId,
    storyId,
    text,
  });
  const commentId = comment._id;
  const story = await Story.updateOne(
    { _id: storyId },
    {
      $addToSet: { comments: { _id: commentId } },
    }
  );
  return res.status(201).json({ msg: "comment added" });
});
const updateComment = asyncHandler(async (req, res) => {
  const userId = req.user;
  const { text } = req.body;
  const storyId = req.params.storyId;
  const commentId = req.params.commentId;
  const comment = await Comment.updateOne(
    { _id: commentId, storyId, userId },
    {
      text,
    },
    { new: true }
  );
  if (comment.modifiedCount == 1 && comment.matchedCount == 1) {
    return res.status(200).json({ msg: "comment updated successfully" });
  }
  return res.status(400).json({ msg: "comment not updated" });
});
const deleteComment = asyncHandler(async (req, res) => {
  const userId = req.user;
  const storyId = req.params.storyId;
  const commentId = req.params.commentId;
  const comment = await Comment.findOneAndDelete({
    _id: commentId,
    storyId,
    userId,
  });
  if (comment) {
    const story = await Story.updateOne(
      { _id: storyId },
      {
        $pull: { comments: { _id: commentId } },
      }
    );
    return res.status(200).json({ msg: "comment deleted successfully" });
  }
  req.statusCode = 400;
  throw new Error("comment not found");
});

module.exports = { createComment, updateComment, deleteComment };