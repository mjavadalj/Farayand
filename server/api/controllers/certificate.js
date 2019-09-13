const mongoose = require("mongoose");
const Certificate = require("../models/certificate");
const moment = require("moment-jalaali");
const handler = (json, res, code) => {
  res.status(code).json(json);
};

module.exports.add = (req, res) => {
  const cer = new Certificate({
    _id: mongoose.Types.ObjectId(),
    teacherId: req.body.teacherId,
    userId: req.body.userId,
    courseId: req.body.courseId,
    lessonId: req.body.lessonId,
    teacherName: req.body.teacherName,
    userName: req.body.userName,
    courseTitle: req.body.courseTitle,
    lessonTitle: req.body.lessonTitle,
    score: req.body.score
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
  //query
  Certificate.find({})
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
