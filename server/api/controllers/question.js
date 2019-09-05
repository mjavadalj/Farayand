const mongoose = require("mongoose");
const Embed = require("../models/embed");

const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};

const questionItems = (req, text = "") => {
  json = {};
  if (req.body.text != undefined) json[`${text}text`] = req.body.text;
  if (req.body.option_1 != undefined)
    json[`${text}option_1`] = req.body.option_1;
  if (req.body.option_2 != undefined)
    json[`${text}option_2`] = req.body.option_2;
  if (req.body.option_3 != undefined)
    json[`${text}option_3`] = req.body.option_3;
  if (req.body.option_4 != undefined)
    json[`${text}option_4`] = req.body.option_4;
  if (req.body.correctAnswer != undefined)
    json[`${text}correctAnswer`] = req.body.correctAnswer;
  return json;
};
module.exports.add = (req, res) => {
    find = {
        _id: req.body.courseId,
        "lessons._id": req.body.lessonId,
        "lessons.sessions._id": mong(req.body.sessionId)
      };
      Embed.updateOne(
        find,
        {
          $push: {
            "lessons.$[].sessions.$[elem].questions": req.body.question
          }
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
};

module.exports.deleteAQuestion = (req, res) => {
    find = {
        _id: req.body.courseId,
        "lessons._id": req.body.lessonId,
        "lessons.sessions._id": mong(req.body.sessionId),
        "lessons.sessions.questions._id": mong(req.body.questionId)
      };
      Embed.updateOne(
        find,
        {
          $pull: {
            "lessons.$[].sessions.$[elem].questions": {
              _id: req.body.questionId
            }
          }
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
};

module.exports.deleteAllQuestions = (req, res) => {
    find = {
        _id: req.body.courseId,
        "lessons._id": req.body.lessonId,
        "lessons.sessions._id": mong(req.body.sessionId)
      };
      Embed.updateOne(
        find,
        {
          $set: {
            "lessons.$[].sessions.$[elem].questions": []
          }
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
};

module.exports.editAQuestion = (req, res) => {
    newQuestion=questionItems(req,"lessons.$[].sessions.$[].questions.$[elem].")
    find = {
      _id: req.body.courseId,
      "lessons._id": req.body.lessonId,
      "lessons.sessions._id": mong(req.body.sessionId),
      "lessons.sessions.questions._id": mong(req.body.questionId)
    };
    Embed.updateOne(
      find,
      {
        $set: newQuestion
      },
      {
        new: true,
        arrayFilters: [{ "elem._id": mong(req.body.questionId) }]
      }
    )
      .exec()
      .then(result => {
        handler(result, res, 200);
      })
      .catch(err => {
        handler(err, res, 500);
      });
};

