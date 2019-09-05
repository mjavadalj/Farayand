const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const Embed = require("../models/embed");
const moment = require("moment-jalaali");
//show all sessions
router.get("/showall", (req, res) => {
  find = {
    _id: mong(req.body.courseId),
    "lessons._id": mong(req.body.lessonId)
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
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
});
//show a session || show all questions
router.get("/show", (req, res) => {
  find = {
    _id: mongoose.Types.ObjectId(req.body.courseId),
    "lessons._id": mongoose.Types.ObjectId(req.body.lessonId),
    "lessons.sessions._id": mongoose.Types.ObjectId(req.body.sessionId)
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
      $unwind: {
        path: "$lessons.sessions",
        includeArrayIndex: "index"
        // "preserveNullAndEmptyArrays": true
      }
    },
    {
      $match: find
    }
  ])
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
});
//add session
router.patch("/add", (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(find, {
    $push: {
      "lessons.$.sessions": req.body.session
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
//edit a session
router.patch("/edit", (req, res) => {
  newItems = editItems(req, "lessons.$[].sessions.$[elem].");

  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId,
    "lessons.sessions._id": mong(req.body.sessionId)
  };
  Embed.updateOne(
    find,
    {
      $set: newItems
    },
    {
      new: true,
      arrayFilters: [{ "elem._id": mong(req.body.sessionId) }]
    }
  )
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//delete a session
router.patch("/delete", (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(find, {
    $pull: {
      "lessons.$.sessions": {
        _id: req.body.sessionId
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
//delete all sessions
router.patch("/deleteall", (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(find, {
    $set: {
      "lessons.$.sessions": []
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
