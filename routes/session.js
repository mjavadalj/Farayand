const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const Quiz = require("../models/quiz");
const Session = require("../models/session");
const moment = require("moment-jalaali");
const delete_ref = require("../middlewares/delete_ref");
//add new session
router.post("/add", (req, res) => {
  const session = new Session({
    _id: mongoose.Types.ObjectId(),
    date_jalali: moment(),
    title: req.body.title,
    content: req.body.content,
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
//Show all sessions
router.get("/showall", (req, res) => {
  Session.find({})
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Show a session
router.get("/show/:id", (req, res) => {
  Session.findOne({ _id: req.params.id })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Delete all sessions without deleting quizzes
router.delete("/deleteall", (req, res) => {
  Session.deleteMany({})
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Delete a session without deleting quiz
router.delete("/delete/:id", (req, res) => {
  Session.deleteOne({ _id: req.params.id })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Delete a session and quiz
router.delete("/delete/:id/withquiz",delete_ref.quiz, (req, res) => {
  Session.deleteOne({ _id: req.params.id })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//edit a session
router.patch("/edit/:id", (req, res) => {
  temp = {};
  if (req.body.title) temp.title = req.body.title;
  if (req.body.content) temp.content = req.body.content;
  if (req.body.publishable) temp.publishable = req.body.publishable;
  Session.findByIdAndUpdate(req.params.id, {
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
//add and set quiz to a session
router.patch("/:id/quiz/add", (req, res) => {
  Session.findByIdAndUpdate(req.params.id, {
    $set: {
      quiz: req.body.quiz
    }
  })
    .exec()
    .then(result => {
      Quiz.findByIdAndUpdate(req.body.quiz, {
        $set: {
          sessionParent: req.params.id
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
//Delete quiz of session
//TODO: better option??
router.patch("/:id/quiz/delete", (req, res) => {
  Session.findByIdAndUpdate(req.params.id, {
    $set: {
      quiz: undefined
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
//TODO: files
const handler = (json, res, code) => {
  res.status(code).json(json);
};
module.exports = router;
