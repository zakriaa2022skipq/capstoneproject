const express = require("express");
const {
  createStory,
  deleteStory,
  updateStory,
} = require("../controller/story");
const { upvoteStory, downvoteStory } = require("../controller/vote");
const {
  createComment,
  updateComment,
  deleteComment,
} = require("../controller/comment");
const {
  getTrendingStories,
  getEngagementStories,
  getLeaderboard,
  getTimelineStories,
} = require("../controller/trending");
const authMiddleware = require("../middleware/auth");
const { uploadStory } = require("../middleware/fileupload");

const router = express.Router();
router.route("/all").get(authMiddleware, (req, res) => {
  console.log(req.user);
  return res.sendStatus(200);
});
router.route("/").post(
  authMiddleware,
  uploadStory.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createStory
);
router
  .route("/:storyId")
  .patch(
    authMiddleware,
    uploadStory.fields([
      { name: "video", maxCount: 1 },
      { name: "image", maxCount: 1 },
    ]),
    updateStory
  )
  .delete(authMiddleware, deleteStory);

router.route("/:storyId/upvote").patch(authMiddleware, upvoteStory);
router.route("/:storyId/downvote").patch(authMiddleware, downvoteStory);
router.route("/:storyId/comment").put(authMiddleware, createComment);
router.route("/:storyId/comment/:commentId").put(authMiddleware, updateComment);
router
  .route("/:storyId/comment/:commentId")
  .delete(authMiddleware, deleteComment);

router.route("/trending").get(authMiddleware, getTrendingStories);
router.route("/engagement").get(authMiddleware, getEngagementStories);
router.route("/leaderboard").get(authMiddleware, getLeaderboard);
router.route("/timeline").get(authMiddleware, getTimelineStories);

module.exports = router;
