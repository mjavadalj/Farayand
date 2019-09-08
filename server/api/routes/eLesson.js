const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const lessonController = require('../controllers/lesson')

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

module.exports = router;
