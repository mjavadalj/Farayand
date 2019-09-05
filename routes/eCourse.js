const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const Embed = require("../models/embed");
const moment = require("moment-jalaali");
//TODO: LEAN()
/* COURSE*/
//add new embed course
router.post("/add", (req, res) => {
  const embed = new Embed({
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
//Show all embed courses
router.get("/showall", (req, res) => {
  Embed.find({})
    .select("lessons")
    .lean()
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Show an embed course
router.get("/show/", (req, res) => {
  Embed.findById(req.body.courseId)
    .select("-lessons")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Delete all embed courses
router.delete("/deleteall", (req, res) => {
  Embed.remove({})
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Delete an embed course
router.delete("/delete", (req, res) => {
  Embed.remove({ _id: req.body.courseId })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//edit an embed course
router.patch("/edit", (req, res) => {
  newItems = {};
  if (req.body.title != undefined) newItems.title = req.body.title;
  if (req.body.content != undefined) newItems.content = req.body.content;
  if (req.body.publishable != undefined)
    newItems.publishable = req.body.publishable;
  if (req.body.forAllUniversities != undefined)
    newItems.forAllUniversities = req.body.forAllUniversities;

  Embed.findByIdAndUpdate(req.body.courseId, {
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
