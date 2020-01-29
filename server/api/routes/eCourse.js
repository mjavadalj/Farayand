const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Embed = require("../models/embed");
const moment = require("moment-jalaali");
const courseController = require("../controllers/course");
const passport = require("passport");
const auth = require("../middlewares/authintication");
/* COURSE*/

// passport.authenticate("jwt", {
//     session: false
//   }),
//   auth.isAdmin,
//add new embed course
router.post(
  "/add",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  courseController.addCourse
);

//Show all embed courses
router.post(
  "/showall",
  passport.authenticate("jwt", {
    session: false
  }),
  courseController.showAllCourses
);

//Show an embed course
router.get(
  "/show",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  courseController.showSingleCourse
);

//Delete all embed courses
router.delete(
  "/deleteall",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  courseController.deleteAllCourses
);

//Delete an embed course
router.post(
  "/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  courseController.deleteACourse
);

//edit an embed course
router.patch(
  "/edit",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isAdmin,
  courseController.editACourse
);

//add teacher to course
router.patch(
  "/user/add",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isTeacher,
  courseController.addTeacherToCourse
);
//delete teacher from course
router.patch(
  "/user/delete",
  passport.authenticate("jwt", {
    session: false
  }),
  auth.isTeacher,
  courseController.deleteTeacherFromCourse
);
//course count
router.get(
  "/count",
  passport.authenticate("jwt", {
    session: false
  }),
  courseController.courseConut
);
//search by course title
router.get(
  "/find",
  passport.authenticate("jwt", {
    session: false
  }),
  courseController.searchCourse
);

module.exports = router;
