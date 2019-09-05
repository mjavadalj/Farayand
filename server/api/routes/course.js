const express = require("express");
const router = express.Router();
const delete_ref = require("../middlewares/delete_ref");
const courseController = require('../controllers/course')

//add new course
router.post("/add", courseController.addCourse);

//Show all courses
router.get("/showall", courseController.showAllCourses);

//Show a Course
router.get("/show/:id", courseController.showSingleCourse);

//Delete all courses
router.delete("/deleteall", courseController.deleteAllCourses);

//Delete a Course
router.delete("/delete/:id", delete_ref.lesson, courseController.deleteACourse);

//edit a Course
router.patch("/edit/:id", courseController.editACourse);

//add lesson to course
router.patch("/:id/lesson/add", courseController.addLessonToCourse);

//delete lesson from course
router.patch("/:id/lesson/delete/:lessonId", courseController.deleteLessonFromCourse);

//TODO: switch sessions
//TODO: pull all sessions
module.exports = router;
