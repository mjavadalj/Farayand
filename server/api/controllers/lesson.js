const mongoose = require("mongoose");
const Embed = require("../models/embed");
const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};
const editItems = (req, text = "") => {
  json = {};
  if (req.body.title != undefined) json[`${text}title`] = req.body.title;
  if (req.body.duration != undefined)
    json[`${text}duration`] = req.body.duration;
  if (req.body.minScore != undefined)
    json[`${text}minScore`] = req.body.minScore;
  if (req.body.content != undefined) json[`${text}content`] = req.body.content;
  if (req.body.secondChance != undefined)
    json[`${text}secondChance`] = req.body.secondChance;
  if (req.body.publishable != undefined)
    json[`${text}publishable`] = req.body.publishable;
  if (req.body.forAllUniversities != undefined)
    json[`${text}forAllUniversities`] = req.body.forAllUniversities;
  return json;
};
module.exports.addLesson = (req, res) => {
    Embed.findByIdAndUpdate(req.body.courseId, {
        $push: {
          lessons: req.body.lesson
        }
      },{
        new:true
      })
        .exec()
        .then(result => {
          handler(result, res, 200);
        })
        .catch(err => {
          handler(err, res, 500);
        });
};

module.exports.showAllLessons = (req, res) => {
    Embed.findById(req.body.courseId)
    .select("-lessons.sessions")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};

module.exports.showSingleLesson = (req, res) => {
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
};

module.exports.deleteAllLessons = (req, res) => {
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
};

module.exports.deleteALesson = (req, res) => {
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
};

module.exports.editLesson = (req, res) => {
    newItems = editItems(req, "lessons.$.");
    find = {
      _id: req.body.courseId,
      "lessons._id": req.body.lessonId
    };
    Embed.findOneAndUpdate(find, {
      $set: newItems
    },{new:true})
      .exec()
      .then(result => {
        handler(result, res, 200);
      })
      .catch(err => {
        handler(err, res, 500);
      });
};




