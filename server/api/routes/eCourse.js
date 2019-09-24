const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Embed = require("../models/embed");
const moment = require("moment-jalaali");
const courseController = require("../controllers/course");
//TODO: LEAN()
/* COURSE*/
//add new embed course
router.post("/add", courseController.addCourse);

//Show all embed courses
router.post("/showall", courseController.showAllCourses);

//Show an embed course
router.get("/show/", courseController.showSingleCourse);

//Delete all embed courses
router.delete("/deleteall", courseController.deleteAllCourses);

//Delete an embed course
router.post("/delete", courseController.deleteACourse);

//edit an embed course
router.patch("/edit", courseController.editACourse);

//add teacher to course
router.patch("/user/add", courseController.addTeacherToCourse);
//delete teacher from course
router.patch("/user/delete", courseController.deleteTeacherFromCourse);
//course count
router.get("/count", courseController.courseConut);


module.exports = router;
