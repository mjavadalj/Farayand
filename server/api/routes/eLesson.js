const express = require("express");
const router = express.Router();
const lessonController = require("../controllers/lesson");
const multer = require("multer");
const passport = require("passport");
const auth = require("../middlewares/authintication");
const storage = multer.diskStorage({
  destination: (req, file, callBack) => {
    callBack(null, __dirname + "../../../files");
  },
  filename: (req, file, callBack) => {
    callBack(null, `${req.body.lessonId}.${file.originalname}`);
  }
});

const fileFilter = (req, file, callBack) => {
  if (
    file.mimetype === "video/mp4" ||
    file.mimetype === "application/zip" ||
    file.mimetype === "application/pdf"
  ) {
    callBack(null, true);
  } else {
    callBack(new Error("not supported"), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 50
  },
  fileFilter
});
//show all lessons
router.post("/showall", lessonController.showAllLessons);
//show a lesson
router.get(
  "/show",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  lessonController.showSingleLesson
);
//add lesson
router.patch(
  "/add",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  lessonController.addLesson
);
//edit a lesson
router.patch(
  "/edit",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  lessonController.editLesson
);
//delete a lesson
router.patch(
  "/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  lessonController.deleteALesson
);
//delete all lessons
router.patch(
  "/deleteall",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  lessonController.deleteAllLessons
);
router.post(
  "/addFile",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  upload.single("file"),
  lessonController.addFile
);
router.post(
  "/showfiles",
  passport.authenticate("jwt", {
    session: false
  }),
  lessonController.showFiles
);
router.patch(
  "/deletefile",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  lessonController.deleteFile
);

module.exports = router;
