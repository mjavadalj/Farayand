const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const Embed = require("../models/embed");
const moment = require("moment-jalaali");
//show all lessons
router.get("/showall", (req, res) => {
  Embed.findById(req.body.courseId)
    .select("-lessons.sessions")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//show a lesson
router.get("/show", (req, res) => {
  find = {
    _id: mongoose.Types.ObjectId(req.body.courseId),
    "lessons._id": mongoose.Types.ObjectId(req.body.lessonId)
  };
  Embed.aggregate([
    {
      $unwind: {
        path: "$lessons",
        includeArrayIndex: "index"
        // "preserveNullAndEmptyArrays": true
      }
    },
    {
      $match: find
    }
  ])
    .lean()
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
});
//add lesson
router.patch("/add", (req, res) => {
  Embed.findByIdAndUpdate(req.body.courseId, {
    $push: {
      lessons: req.body.lesson
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
//edit a lesson
router.patch("/edit", (req, res) => {
  newItems = editItems(req, "lessons.$.");
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(find, {
    $set: newItems
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//delete a lesson
router.patch("/delete", (req, res) => {
  find = {
    _id: req.body.courseId
  };
  Embed.findOneAndUpdate(find, {
    $pull: {
      lessons: {
        _id: req.body.lessonId
      }
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
//delete all lessons
router.patch("/deleteall", (req, res) => {
  find = {
    _id: req.body.courseId
  };
  Embed.findOneAndUpdate(find, {
    $set: {
      lessons: []
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

const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};
const editItems = (req, text = "") => {
  json = {};
  if (req.body.title!= undefined) json[`${text}title`] = req.body.title;
  if (req.body.duration!= undefined) json[`${text}duration`] = req.body.duration;
  if (req.body.minScore!= undefined) json[`${text}minScore`] = req.body.minScore;
  if (req.body.content!= undefined) json[`${text}content`] = req.body.content;
  if (req.body.secondChance!= undefined)
    json[`${text}secondChance`] = req.body.secondChance;
  if (req.body.publishable!= undefined) json[`${text}publishable`] = req.body.publishable;
  if (req.body.forAllUniversities!= undefined)
    json[`${text}forAllUniversities`] = req.body.forAllUniversities;
  return json;
};

module.exports = router;
