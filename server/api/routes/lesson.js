const express = require("express");
const router = express.Router();
const delete_ref = require("../middlewares/delete_ref");
const lessonController = require('../controllers/lesson')

//add new lesson
router.post("/add", lessonController.addLesson);

//Show all lessons
router.get("/showall", lessonController.showAllLessons);

//Show a lesson
router.get("/show/:id", lessonController.showSingleLesson);

//Delete all lessons
router.delete("/deleteall", lessonController.deleteAllLessons);

//Delete a lesson
router.delete("/delete/:id", delete_ref.session, lessonController.deleteALesson);

//edit a lesson
router.patch("/edit/:id", lessonController.editLesson);

//add session to lesson
router.patch("/:id/session/add", lessonController.addSessionToLesson);

//delete session from lesson
router.patch("/:id/session/delete/:sessionId", lessonController.deleteSessonFromLesson);

//TODO: switch sessions
//TODO: pull all sessions
module.exports = router;
