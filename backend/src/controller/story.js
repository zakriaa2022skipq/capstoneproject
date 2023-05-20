const story = require("../models/story");
const Story = require("../models/story");
const asyncHandler = require("express-async-handler");

const createStory = asyncHandler(async (req, res) => {
  const { text, isPublic } = req.body;
  const userId = req.user;
  const story = { userId, isPublic };
  if (text) {
    story["text"] = text;
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
});
const updateStory = asyncHandler(async (req, res) => {
  const { text, isPublic } = req.body;
  const userId = req.user;
  const storyId = req.params.storyId;
  const story = {};
  if (isPublic != undefined) {
    story["isPublic"] = isPublic;
  }
  if (text) {
    story["text"] = text;
  }
  if (req.files?.video) {
    const video = req.files.video[0].filename;
    story["video"] = video;
  }
  if (req.files?.image) {
    const image = req.files.image[0].filename;
    story["image"] = image;
  }
  const newStory = await Story.findOneAndUpdate(
    { userId, _id: storyId },
    story,
    { new: true }
  );
  return res.status(200).json({ msg: "updated story successfully" });
});

const deleteStory = asyncHandler(async (req, res) => {
  const userId = req.user;
  const storyId = req.params.storyId;
  const story = await Story.findOneAndDelete({ userId, _id: storyId });
  if (story) {
    return res.status(200).json({ msg: "story deleted successfully" });
  }
  req.statusCode = 400;
  throw new Error("Story not found");
});

module.exports = { createStory, updateStory, deleteStory };
