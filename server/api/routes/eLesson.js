const express = require("express");
const router = express.Router();
const lessonController = require('../controllers/lesson')
const multer = require("multer");
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
router.get("/show",lessonController.showSingleLesson);
//add lesson
router.patch("/add",lessonController.addLesson);
//edit a lesson
router.patch("/edit",lessonController.editLesson);
//delete a lesson
router.patch("/delete",lessonController.deleteALesson);
//delete all lessons
router.patch("/deleteall",lessonController.deleteAllLessons);
router.post("/addFile", upload.single("file"), lessonController.addFile);
router.post("/showfiles", lessonController.showFiles);
router.patch("/deletefile", lessonController.deleteFile);

module.exports = router;
