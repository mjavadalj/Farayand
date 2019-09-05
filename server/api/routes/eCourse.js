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
router.get("/showall", courseController.showAllCourses);

//Show an embed course
router.get("/show/", courseController.showSingleCourse);

//Delete all embed courses
router.delete("/deleteall", courseController.deleteAllCourses);

//Delete an embed course
router.delete("/delete", courseController.deleteACourse);

//edit an embed course
router.patch("/edit", courseController.editACourse);

module.exports = router;
