const mongoose = require("mongoose");
const Embed = require("../models/embed");
const User = require("../models/user");
const moment = require("moment-jalaali");
const HummusRecipe = require("hummus-recipe");
const fs = require("fs");

const createFile=(files,cb)=>{
  // sep=files[0].name.split('/')
  // fileName=sep[sep.length-1]
  fileName="5def7ce8f8dd8345bcae1038.1.pdf"
  console.log(fileName);
  console.log(__dirname);
  
  if (fs.existsSync("../../files/"+fileName)) {
    console.log("ok");
  }
  cb()
}
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
  if (req.body.limitation != undefined)
    json[`${text}limitation`] = req.body.limitation;
  if (req.body.starting_page != undefined)
    json[`${text}starting_page`] = req.body.starting_page;
  if (req.body.ending_page != undefined)
    json[`${text}ending_page`] = req.body.ending_page;
  return json;
};
const randomQuestions = (res, arr, n) => {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  handler(result, res, 200);
};
module.exports.addASession = (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(
    find,
    {
      $push: {
        "lessons.$.sessions": req.body.session
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      createFile(result.lessons[0].files,()=>{})
      console.log(result);
      
      handler({status:"updated"}, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAllSessions = (req, res) => {
  find = {
    $and: [
      { _id: mong(req.body.courseId) },
      { "lessons._id": mong(req.body.lessonId) }
    ]
  };
  Embed.aggregate([
    {
      $unwind: {
        path: "$lessons"

        // "preserveNullAndEmptyArrays": true
      }
    },
    {
      $unwind: {
        path: "$lessons.sessions"

        // "preserveNullAndEmptyArrays": true
      }
    },
    {
      $match: find
    },
    {
      $project: {
        _id: "$lessons.sessions._id",
        ending_page: "$lessons.sessions.ending_page",
        starting_page: "$lessons.sessions.starting_page",
        content: "$lessons.sessions.content",
        duration: "$lessons.sessions.duration",
        minScore: "$lessons.sessions.minScore",
        secondChance: "$lessons.sessions.secondChance",
        userQCount: "$lessons.sessions.userQCount",
        title: "$lessons.sessions.title",
        quizDate: "$lessons.sessions.quizDate",
        questionLength: { $size: "$lessons.sessions.questions" },
        files:"$lessons.files"
      }
    }
  ])
    // sort('-lessons.date')
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
};
module.exports.showAllQuestions = (req, res) => {
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
      handler(result[0].lessons.sessions.questions, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
};
module.exports.showRandomQuestions = (req, res) => {
  find = {
    $and: [
      { _id: mongoose.Types.ObjectId(req.body.courseId) },
      { "lessons._id": mongoose.Types.ObjectId(req.body.lessonId) },
      { "lessons.sessions._id": mongoose.Types.ObjectId(req.body.sessionId) }
    ]
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
    },
    {
      $project: {
        userQCount: "$lessons.sessions.userQCount",
        questions: "$lessons.sessions.questions"
      }
    }
  ])
    .exec()
    .then(result => {
      var limitedQuestions = [];
      result[0].questions.forEach(question => {
        limitedQuestions.push({
          option_1: {
            text: question.option_1.text
          },
          option_2: {
            text: question.option_2.text
          },
          option_3: {
            text: question.option_3.text
          },
          option_4: {
            text: question.option_4.text
          },
          text: question.text,
          _id: question._id
        });
      });
      const userQCount = result[0].userQCount;
      const length = result[0].questions.length;
      var number;
      number = userQCount > length ? length : userQCount;
      randomQuestions(res, limitedQuestions, number);
      // handler(result[0].lessons.sessions, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
};
module.exports.deleteAllSessons = (req, res) => {
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
};
module.exports.deleteSingleSession = (req, res) => {
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
};
module.exports.editASession = (req, res) => {
  newItems = editItems(req, "lessons.$[].sessions.$[elem].");

  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId,
    "lessons.sessions._id": mong(req.body.sessionId)
  };
  Embed.findOneAndUpdate(
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
};
module.exports.checkQuiz = (req, res) => {
  find = {
    $and: [
      { _id: mongoose.Types.ObjectId(req.body.courseId) },
      { "lessons._id": mongoose.Types.ObjectId(req.body.lessonId) },
      { "lessons.sessions._id": mongoose.Types.ObjectId(req.body.sessionId) }
    ]
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
    },
    {
      $project: {
        minScore: "$lessons.sessions.minScore",
        questions: "$lessons.sessions.questions",
        userQCount: "$lessons.sessions.userQCount"
      }
    }
  ])
    .exec()
    .then(result => {
      Qlength = result[0].userQCount;
      if (result[0].userQCount > result[0].questions.length) {
        Qlength = result[0].questions.length;
      }
      correctAnswer = 0;
      answerBody = req.body.answerBody;
      Object.keys(answerBody).forEach(id => {
        result[0].questions.forEach(question => {
          if (question._id == id && question[answerBody[id]].correct) {
            correctAnswer++;
          }
        });
      });
      // handler({ score: Math.ceil((correctAnswer / Qlength) * 100) }, res, 200);
      score = Math.ceil((correctAnswer / Qlength) * 100);
      passed = score >= req.body.minScore;
      find = {
        _id: req.user.userId,
        "reg_lessons._id": req.body.reg_lessonId,
        "reg_lessons.reg_sessions._id": req.body.reg_sessionId
      };
      User.updateOne(
        find,
        {
          $set: {
            "reg_lessons.$[].reg_sessions.$[elem]": {
              score,
              tryCount: req.body.tryCount,
              passed,
              anotherChanceDate: req.body.anotherChanceDate,
              title: req.body.title,
              sessionId: req.body.sessionId,
              _id: req.body.reg_sessionId,
              date: req.body.date
            }
          }
        },
        {
          new: true,
          arrayFilters: [{ "elem._id": mong(req.body.reg_sessionId) }]
        }
      )
        .exec()
        .then(user => {
          res.status(200).json({
            score,
            passed
          });
        })
        .catch(err => {
          handler(err, res, 500);
        });
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
