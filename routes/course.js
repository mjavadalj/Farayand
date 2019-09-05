const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const Lesson = require("../models/lesson");
const Session = require("../models/session");
const Course = require("../models/course");
const delete_ref = require("../middlewares/delete_ref");
const moment = require("moment-jalaali");
//add new course
router.post("/add", (req, res) => {
  const course = new Course({
    _id: mongoose.Types.ObjectId(),
    date_jalali: moment(),
    title: req.body.title,
    content: req.body.content,
    forAllUniversities: req.body.forAllUniversities,
    publishable: req.body.publishable
  })
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//Show all courses
router.get("/showall", (req, res) => {
    Course.find({})
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Show a Course
router.get("/show/:id", (req, res) => {
    Course.findById(req.params.id)
    .populate("sessions")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Delete all courses
router.delete("/deleteall", (req, res) => {
    Course.deleteMany({})
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Delete a Course
router.delete("/delete/:id",delete_ref.lesson, (req, res) => {
    Course.deleteOne({ _id: req.params.id })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//edit a Course
router.patch("/edit/:id", (req, res) => {
  temp = {};
  if (req.body.title) temp.title = req.body.title;
  if (req.body.forAllUniversities) temp.forAllUniversities = req.body.forAllUniversities;
  if (req.body.content) temp.content = req.body.content;
  if (req.body.publishable) temp.publishable = req.body.publishable;
  
  Course.findByIdAndUpdate(req.params.id, {
    $set: temp
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//add lesson to course
router.patch("/:id/lesson/add", (req, res) => {
  Course.findOneAndUpdate(
    { _id: req.params.id },
    {
      $addToSet: {
        lessons: req.body.lesson
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      var index = 0;
      if (result.lessons.length != 0) index = result.lessons.length - 1;
      const lessonId = result.lessons[index];

      Lesson.findByIdAndUpdate(lessonId, {
        $set: {
          courseParent: req.params.id
        }
      })
        .exec()
        .then()
        .catch(err => handler(err, res, 500));
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//delete lesson from course
router.patch("/:id/lesson/delete/:lessonId", (req, res) => {
  Course.findByIdAndUpdate(req.params.id, {
    $pull: {
        lessons: req.params.lessonId
    }
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {

      handler(err, res, 500);
    });
});
//TODO: switch sessions
//TODO: pull all sessions
const handler = (json, res, code) => {
  res.status(code).json(json);
};
module.exports = router;
