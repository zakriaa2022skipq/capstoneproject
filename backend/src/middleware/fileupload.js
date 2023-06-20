const multer = require("multer");
const path = require("path");
const profilePicstorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/profile"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const uploadProfilePic = multer({
  storage: profilePicstorage,
  fileFilter: function (req, file, callback) {
    const validMIMEType = new Set(["image/png", "image/jpeg"]);
    if (!validMIMEType.has(file.mimetype)) {
      return callback(new Error("Only images are allowed"));
    }
    callback(null, true);
  },
});
const storyStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/story"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const uploadStory = multer({
  storage: storyStorage,
  fileFilter: function (req, file, callback) {
    const validMIMEType = new Set([
      "image/png",
      "image/jpeg",
      "video/mp4",
      "video/JPEG",
      "video/AV1",
      "video/x-matroska",
    ]);
    if (!validMIMEType.has(file.mimetype)) {
      return callback(new Error("Only images and videos are allowed"));
    }
    callback(null, true);
  },
});

module.exports = { uploadProfilePic, uploadStory };
