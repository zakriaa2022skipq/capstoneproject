const express = require("express");
const {
  createStory,
  deleteStory,
  updateStory,
  storyDetail,
} = require("../controller/story");
const { upvoteStory, downvoteStory } = require("../controller/vote");
const {
  createComment,
  updateComment,
  deleteComment,
  storyComments,
} = require("../controller/comment");
const {
  getTrendingStories,
  getEngagementStories,
  getLeaderboard,
  getTimelineStories,
  getAllUserStories,
} = require("../controller/trending");
const authMiddleware = require("../middleware/auth");
const { uploadStory } = require("../middleware/fileupload");
const {
  createStorySchema,
  editStorySchema,
} = require("../validation/storyValidation");
const {
  createCommentSchema,
  editCommentSchema,
} = require("../validation/commentValidation");

const router = express.Router();
router.route("/all").get(authMiddleware, getAllUserStories);
router.route("/").post(
  authMiddleware,
  uploadStory.fields([
    { name: "video", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  createStorySchema,
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
    editStorySchema,
    updateStory
  )
  .delete(authMiddleware, deleteStory);

router.route("/:storyId/upvote").patch(authMiddleware, upvoteStory);
router.route("/:storyId/downvote").patch(authMiddleware, downvoteStory);
router
  .route("/:storyId/comment")
  .get(authMiddleware, storyComments)
  .put(authMiddleware, createCommentSchema, createComment);
router
  .route("/:storyId/comment/:commentId")
  .put(authMiddleware, editCommentSchema, updateComment);
router
  .route("/:storyId/comment/:commentId")
  .delete(authMiddleware, deleteComment);

router.route("/trending").get(authMiddleware, getTrendingStories);
router.route("/engagement").get(authMiddleware, getEngagementStories);
router.route("/leaderboard").get(authMiddleware, getLeaderboard);
router.route("/timeline").get(authMiddleware, getTimelineStories);

router.route("/detail/:storyId").get(authMiddleware, storyDetail);
module.exports = router;
