const mongoose = require("mongoose");
const User = require("../models/user");
const Embed = require("../models/embed");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const jwtSecret = config.get("app.webServer.jwtSecret");
const { validationResult } = require("express-validator");
const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};
const editItems = (req, text = "") => {
  json = {};
  if (req.body.username != undefined)
    json[`${text}username`] = req.body.username;
  if (req.body.password != undefined)
    json[`${text}password`] = req.body.password;
  if (req.body.email != undefined) json[`${text}email`] = req.body.email;
  if (req.body.confirmed != undefined)
    json[`${text}confirmed`] = req.body.confirmed;
  if (req.body.name != undefined) json[`${text}name`] = req.body.name;
  if (req.body.phoneNumber != undefined)
    json[`${text}phoneNumber`] = req.body.phoneNumber;
  return json;
};

module.exports.addAUser = (req, res) => {
  const user = new User({
    _id: mongoose.Types.ObjectId(),
    name: req.body.name,
    role: req.body.role,
    confirmed: req.body.confirmed,
    username: req.body.username,
    password: req.body.password,
    phoneNumber: req.body.phoneNumber,
    gender: req.body.gender,
    email: req.body.email
  })
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};

module.exports.showAllUsers = (req, res) => {
  User.find({})
    .select("-reg_lessons")
    .populate("university")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
};

module.exports.signup = (req, res) => {
  if (validationResult(req).errors.length > 0) {
    return res.status(422).json(validationResult(req));
  }
  User.find({
    email: req.body.email
  }).then(user => {
    if (user.length > 0) {
      return res.status(401).json({
        message: "email already exist"
      });
    } else {
      bcrypt
        .hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              err
            });
          } else {
            new User({
              _id: mongoose.Types.ObjectId(),
              email: req.body.email,
              username: req.body.username,
              password: hash,
              role: "normal"
            })
              .save()
              .then(user => {
                return res.status(200).json({
                  message: "sign up compelete"
                });
              })
              .catch(err => {
                return res.status(500).json({
                  err
                });
              });
          }
        })
        .catch(err => {
          return res.status(500).json({
            err
          });
        });
    }
  });
};

module.exports.signin = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(401).json({
          message: "email not exist"
        });
      } else {
        console.log(user);
        bcrypt.compare(req.body.password, user.password, (err, same) => {
          if (err) {
            return res.status(500).json({
              message: "cannot compare"
            });
          } else if (same) {
            const jwtpayload = {
              name: user.name,
              email: user.email,
              userId: user._id,
              userName: user.username,
              role: user.role
            };
            jwt.sign(
              jwtpayload,
              jwtSecret,
              {
                expiresIn: "10h"
              },
              (err, encoded) => {
                if (err) {
                  throw new Error("error in jwt");
                } else {
                  return res.status(200).json({
                    done: true,
                    secret: "bearer " + encoded
                  });
                }
              }
            );
          }
        });
      }
    });
};
module.exports.lessonRegister = (req, res) => {
  find = {
    $and: [
      { _id: req.body.userId },
      { "reg_lessons.lessonId": { $ne: mong(req.body.lessonId) } }
    ]
  };
  User.findOneAndUpdate(
    find,
    {
      $push: {
        reg_lessons: {
          courseTitle: req.body.courseTitle,
          lessonTitle: req.body.lessonTitle,
          teacherName: req.body.teacherName,
          sessionLength: req.body.sessionLength,
          lessonId: req.body.lessonId,
          courseId: req.body.courseId,
          teacherId: req.body.teacherId
        }
      }
    },
    { new: true }
  )
    .select('_id')
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.sessionRegister = (req, res) => {
  find = {
    $and: [
      { _id: req.body.userId },
      { "reg_lessons._id": req.body.reg_lessonId },
      {
        "reg_lessons.reg_sessions.sessionId": { $ne: mong(req.body.sessionId) }
      }
    ]
  };
  User.findOneAndUpdate(
    find,
    {
      $push: {
        "reg_lessons.$.reg_sessions": {
          sessionId: req.body.sessionId,
          title: req.body.title,
          passed: req.body.passed,
          anotherChanceDate: req.body.anotherChanceDate,
          tryCount: req.body.tryCount,
          score: req.body.score
        }
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.sessionComplete = (req, res) => {
  find = {
    _id: req.body.userId,
    "reg_lessons._id": req.body.reg_lessonId,
    "reg_lessons.reg_sessions._id": req.body.reg_sessionId
  };
  User.updateOne(
    find,
    {
      $set: {
        "reg_lessons.$[].reg_sessions.$[elem]": {
          score: req.body.score,
          tryCount: req.body.tryCount,
          passed: req.body.passed,
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
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.lessonComplete = (req, res) => {
  find = {
    $and: [
      { _id: req.body.userId },
      { "reg_lessons._id": req.body.reg_lessonId }
    ]
  };
  User.findOneAndUpdate(
    find,
    {
      $set: {
        "reg_lessons.$.passed": req.body.passed,
        "reg_lessons.$.finalScore": req.body.finalScore
      }
    },
    {
      new: true
    }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.deleteAllUsers = (req, res) => {
  User.deleteMany({})
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAllTeachers = (req, res) => {
  User.find({ role: "teacher" })
    .select("-reg_lessons")
    .populate("university")
    .sort("-date")
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAllStudents = (req, res) => {
  User.find({ role: "student" })
    .select("-reg_lessons")
    .populate("university")
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.editUser = (req, res) => {
  newItems = editItems(req);
  User.findOneAndUpdate(
    { _id: req.body.userId },
    {
      $set: newItems
    },
    {
      new: true
    }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.deleteAUser = (req, res) => {
  User.deleteOne({ _id: req.body.userId })
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAllCoursesOfTeacher = (req, res) => {
  find = {
    $and: [
      { user: mong(req.body.user) },
      { publishable: true }
    ]
  };
  Embed.aggregate([
    {
      $unwind: "$user"
    },
    {
      $match: find
    },
    {
      $lookup: {
        from: User.collection.name,
        localField: "creator",
        foreignField: "_id",
        as: "creator"
      }
    },
    {
      $project: {
        title: "$title",
        content: "$content",
        publishable: "$publishable",
        forAllUniversities: "$forAllUniversities",
        date_jalali: "$date_jalali",
        date: "$date",
        user: "$user",
        creator: "$creator.name",
        lessonLength: { $size: "$lessons" }
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
module.exports.showAUser = (req, res) => {
  User.findById(req.body.userId)
    .select("-reg_lessons")
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAUserRegLessons = (req, res) => {
  User.findById(req.body.userId)
    .select("reg_lessons")
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.deleteAUserRegLesson = (req, res) => {
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $pull: {
        reg_lessons: {
          _id: req.body.reg_lessonId
        }
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAllC = (req, res) => {
  User.aggregate([
    {
      $unwind: "$reg_lessons"
    },
    {
      $match: {
        "reg_lessons.passed": true
      }
    },
    {
      $project: {
        teacherName: "$reg_lessons.teacherName",
        userName: "$name",
        university: "$university",
        courseTitle: "$reg_lessons.courseTitle",
        lessonTitle: "$reg_lessons.lessonTitle",
        finalScore: "$reg_lessons.finalScore",
        date: "$date"
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
module.exports.addTeacherUni = (req, res) => {
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $addToSet: {
        university: req.body.uniId
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.addUserUni = (req, res) => {
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $set: {
        university: req.body.uniId
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.removeUserrUni = (req, res) => {
  User.findByIdAndUpdate(
    req.body.userId,
    {
      $pull: {
        university: req.body.uniId
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};

//TODO: select -password
