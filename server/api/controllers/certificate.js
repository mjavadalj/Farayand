const mongoose = require("mongoose");
const Certificate = require("../models/certificate");
const User = require("../models/user");
const moment = require("moment-jalaali");
const handler = (json, res, code) => {
  res.status(code).json(json);
};

module.exports.add = (req, res) => {
  const cer = new Certificate({
    _id: mongoose.Types.ObjectId(),
    userId: req.body.userId,
    userName: req.body.userName,
    lesson: req.body.reg_lessonId
  })
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.delete = (req, res) => {
  Certificate.deleteOne({ _id: req.body.id })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.show = (req, res) => {
  Certificate.findById(req.body.id)
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAll = (req, res) => {
  Certificate.aggregate([
    {
      $lookup: {
        from: User.collection.name,
        localField: "userId",
        foreignField: "_id",
        as: "user"
      }
    }
    ,
    {
      $unwind:"$user"
    }
    ,
    {
      $unwind:"$user.reg_lessons"
    },
    {
      $match:{
        "user.reg_lessons.passed":true
      }
    }
    ,
    {
      $project:{
        _id:"$_id",
        teacherName:"$user.reg_lessons.teacherName",
        userName:"$user.name",
        courseTitle:"$user.reg_lessons.courseTitle",
        lessonTitle:"$user.reg_lessons.lessonTitle",
        finalScore:"$user.reg_lessons.finalScore",
        date:"$date",
      }
    }
  ])
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
