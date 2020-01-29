const mongoose = require("mongoose");
const User = require("../models/user");
const Embed = require("../models/embed");
const config = require("config");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const jwtSecret = config.get("app.webServer.jwtSecret");
const { validationResult } = require("express-validator");
const mailer = require("../middlewares/mailer");
const randomString = require("randomstring");
const Confirmed = require("../models/confirmed");

const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};
const editItems = (req, text = "") => {
  json = {};
  if (req.body.nationalcode != undefined)
    json[`${text}nationalcode`] = req.body.nationalcode;
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
    nationalcode: req.body.nationalcode,
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
    console.log(validationResult(req).errors);
    return res.status(200).json({
      code: 0,
      message: validationResult(req).errors[0].msg
    });
  }
  Confirmed.findOne({
    nationalcode: req.body.nationalcode
  })
    .exec()
    .then(confirmed => {
      if (!confirmed) {
        return res.status(200).json({
          code: 0,
          message: "شما در لیست بسیج اساتید قرار نگرفته اید"
        });
      } else {
        User.find({
          $or: [
            { email: req.body.email },
            { nationalcode: req.body.nationalcode },
            { phoneNumber: req.body.phoneNumber }
          ]
        }).then(user => {
          if (user.length > 0) {
            return res.status(200).json({
              code: 0,
              message: "با این اطلاعات ثبت نام صورت گرفته است"
            });
          } else {
            bcrypt.hash(req.body.password, 10, (err, hash) => {
              if (err) {
                return res.status(200).json({
                  code: 0,
                  message: "مشکلی پیش آمد، دوباره تلاش کنید"
                });
              } else if (
                req.body.role != "teacher" &&
                req.body.role != "student"
              ) {
                return res.status(200).json({
                  code: 0,
                  message: "مجاز به ثبت نام نمی باشید"
                });
              } else {
                new User({
                  _id: mongoose.Types.ObjectId(),
                  name: req.body.name,
                  role: req.body.role,
                  confirmed: true,
                  nationalcode: req.body.nationalcode,
                  password: hash,
                  phoneNumber: req.body.phoneNumber,
                  gender: req.body.gender,
                  email: req.body.email
                })
                  .save()
                  .then(user => {
                    if (user.role == "teacher") {
                      User.findByIdAndUpdate(
                        user._id,
                        {
                          $addToSet: {
                            university: {
                              $each: req.body.uniId
                            }
                            // university: req.body.uniId
                          }
                        },
                        { new: true }
                      )
                        .exec()
                        .then(result => {
                          return res.status(200).json({
                            code: 1,
                            message: "با موفقیت ثبت نام کردید"
                          });
                        })
                        .catch(err => {
                          handler(err, res, 500);
                        });
                    } else if (user.role == "student") {
                      User.findByIdAndUpdate(
                        user._id,
                        {
                          $set: {
                            university: req.body.uniId
                          }
                        },
                        { new: true }
                      )
                        .exec()
                        .then(result => {
                          return res.status(200).json({
                            code: 1,
                            message: "با موفقیت ثبت نام کردید"
                          });
                        })
                        .catch(err => {
                          handler(err, res, 500);
                        });
                    }
                  })
                  .catch(err => {
                    return res.status(200).json({
                      code: 0,
                      message: "مشکلی پیش آمد، دوباره تلاش کنید"
                    });
                  });
              }
            });
            // .catch(err => { // ? is this shit?
            //   return res.status(500).json({
            //     err
            //   });
            // });
          }
        });
      }
    });
};
module.exports.signin = (req, res) => {
  //
  User.findOne({
    nationalcode: req.body.nationalcode
  })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(200).json({
          code: 0,
          message: "کاربری با این کد ملی یافت نشد"
        });
      } else {
        bcrypt.compare(req.body.password, user.password, (err, same) => {
          if (err || !same) {
            return res.status(200).json({
              code: 0,
              message: "رمز اشتباه است"
            });
          } else if (same) {
            const jwtpayload = {
              name: user.name,
              email: user.email,
              userId: user._id,
              nationalcode: user.nationalcode,
              role: user.role,
              gender: user.gender,
              university: user.university
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
                    code: 1,
                    jwt: encoded
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
      { _id: req.user.userId },
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
    .select("_id")
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
      { _id: req.user.userId },
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
          score: 0
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
    .select("name email phoneNumber university name date confirmed")
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
    .select("name email phoneNumber university name date confirmed")
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
  User.remove({ _id: req.body.userId })
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
    $and: [{ user: mong(req.body.user) }, { publishable: true }]
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
        limitation: "$limitation",
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
  User.findById(req.user.userId)
    .select("-reg_lessons")
    .select("-password")
    .populate("university")
    .exec()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAUserRegLessons = (req, res) => {
  User.findById(req.user.userId)
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
    req.user.userId,
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
        nationalcode: "$name",
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
module.exports.showUserCertificates = (req, res) => {
  User.aggregate([
    {
      $unwind: "$reg_lessons"
    },
    {
      $match: {
        "reg_lessons.passed": true,
        nationalcode: req.body.nationalcode
      }
    },
    {
      $project: {
        teacherName: "$reg_lessons.teacherName",
        name: "$name",
        courseTitle: "$reg_lessons.courseTitle",
        lessonTitle: "$reg_lessons.lessonTitle",
        finalScore: "$reg_lessons.finalScore",
        date: "$reg_lessons.date"
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
module.exports.teacherCheckCertificate = (req, res) => {
  User.aggregate([
    {
      $unwind: "$reg_lessons"
    },
    {
      $match: {
        "reg_lessons.passed": true,
        nationalcode: req.body.nationalcode,
        "reg_lessons.teacherId": mong(req.user.userId)
      }
    },
    {
      $project: {
        teacherName: "$reg_lessons.teacherName",
        name: "$name",
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
    req.user.userId,
    {
      $addToSet: {
        university: {
          $each: req.body.uniId
        }
        // university: req.body.uniId
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
    req.user.userId,
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
    req.user.userId,
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
module.exports.setCertificate = (req, res) => {
  find = {
    $and: [
      { _id: mong(req.user.userId) },
      { "reg_lessons._id": mong(req.body.reg_lessonId) }
    ]
  };
  User.aggregate([
    {
      $unwind: "$reg_lessons"
    },
    {
      $match: find
    },
    {
      $project: {
        reg_lesson: "$reg_lessons"
      }
    }
  ])
    .exec()
    .then(user => {
      c = 0;
      const findFalse = user[0].reg_lesson.reg_sessions.find(reg => {
        c++;
        return reg.passed == false;
      });
      if (
        c < user[0].reg_lesson.sessionLength ||
        findFalse ||
        user[0].reg_lesson.passed
      ) {
        handler({ err: "nothing to set" }, res, 500);
      } else {
        finalScore = 0;
        user[0].reg_lesson.reg_sessions.forEach(reg_session => {
          finalScore += reg_session.score;
        });
        finalScore = Math.ceil(
          finalScore / user[0].reg_lesson.reg_sessions.length
        );
        User.findOneAndUpdate(
          find,
          {
            $set: {
              "reg_lessons.$.passed": true,
              "reg_lessons.$.finalScore": finalScore,
              "reg_lessons.$.date": Date.now()
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
            handler({ err: "can't complete lesson" }, res, 500);
          });
        // res.status(200).json(user[0]);
      }
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showUniTeachers = (req, res) => {
  User.find({ role: "teacher", university: mong(req.body.university) })
    .select("name email")
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
module.exports.changeUNI = (req, res) => {
  User.findById(req.user.userId)
    .exec()
    .then(user => {
      if (req.body.uniId.length > 1 && user.role == "student") {
        user.university = [req.body.uniId[0]];
        user.save();
        return res.status(200).json({
          status: "ok"
        });
      } else {
        user.university = req.body.uniId;
        user.save();
        return res.status(200).json({
          status: "ok"
        });
      }
    })
    .catch(err => {
      return res.status(404).json(err);
    });
};
module.exports.resetPassword = (req, res) => {
  User.findOne({
    email: req.body.email
  })
    .exec()
    .then(user => {
      if (!user) {
        return res.status(200).json({
          code: 0,
          message: "هیچ کاربری با ایم ایمیل ثبت نام نکرده است"
        });
      } else {
        const newPassword = randomString.generate({
          capitalization: "lowercase",
          length: 8
        });
        var text = `رمز جدید شما\n${newPassword}`;
        mailer
          .forgetPassword(req.body.email, "درخواست تغییر رمز", text)
          .then(result => {
            console.log(result);
            bcrypt.hash(newPassword, 10, (err, hash) => {
              if (err) {
                return res.status(200).json({
                  code: 0,
                  message: "مشکلی پیش آمد، دوباره تلاش کنید"
                });
              }
              if (hash) {
                user.password = hash;
                user
                  .save()
                  .then(result => {
                    return res.status(200).json({
                      code: 1,
                      message: "رمز جدید به ایمیل شما ارسال شد"
                    });
                  })
                  .catch(err => {
                    console.log(err);
                  });
              }
            });
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    });
};
//TODO: select -password
