const Story = require("../models/story");
const asyncHandler = require("express-async-handler");

const upvoteStory = asyncHandler(async (req, res, next) => {
  const userId = req.user;
  const storyId = req.params.storyId;
  const story = await Story.updateOne(
    { _id: storyId, "upvotes.user": { $ne: userId } },
    {
      $addToSet: { upvotes: { user: userId } },
      $pull: { downvotes: { user: userId } },
    }
  );
  return res.status(200).json({ msg: "upvoted successfully" });
});
const downvoteStory = asyncHandler(async (req, res) => {
  const userId = req.user;
  const storyId = req.params.storyId;
  const story = await Story.updateOne(
    { _id: storyId, "downvotes.user": { $ne: userId } },
    {
      $addToSet: { downvotes: { user: userId } },
      $pull: { upvotes: { user: userId } },
    }
  );
  return res.status(200).json({ msg: "downvoted successfully" });
});

module.exports = { downvoteStory, upvoteStory };
