const Course = require("../models/course");
const Lesson = require("../models/lesson");
const Session = require("../models/session");
const Quiz = require("../models/quiz");
const lesson = (req, res, next) => {
  try {
    Course.findById(req.params.id)
      .select("lessons")
      .lean()
      .exec()
      .then(course => {
        course.lessons.forEach(lessonId => {
          try {
            Lesson.findById(lessonId)
              .select("sessions")
              .lean()
              .exec()
              .then(lesson => {
                lesson.sessions.forEach(sessionId => {
                  try {
                    Quiz.deleteOne({ sessionParent: sessionId }).exec();
                  } catch {
                    return res.status(500).json({
                      message: "delete Failed 1 "
                    });
                  }
                });
                Session.deleteMany({ lessonParent: lessonId }).exec();
              })
              .catch(err => {
                return res.status(500).json({
                  message: "delete Failed  2"
                });
              });
          } catch {
            return res.status(500).json({
              message: "delete Failed 3 "
            });
          }
        });
        Lesson.deleteMany({ courseParent: req.params.id }).exec()
        .then(result=>{
          next()
        })
        .catch()
      })
      .catch(err => {
        return res.status(500).json({
          message: "delete Failed 4 "
        });
      });
  } catch (err) {
    return res.status(500).json({
      message: "delete Failed  5"
    });
  }
};
const session = (req, res, next) => {
  try {
    Lesson.findById(req.params.id)
      .select("sessions")
      .lean()
      .exec()
      .then(result => {
        result.sessions.forEach(sessionId => {
          try {
            Quiz.deleteOne({ sessionParent: sessionId }).exec();
          } catch {
            return res.status(500).json({
              message: "delete Failed "
            });
          }
        });
        Session.deleteMany({ lessonParent: req.params.id }).exec();
        next()
      })
      .catch(err => {
        return res.status(500).json({
          message: "delete Failed "
        });
      });
  } catch (err) {
    return res.status(500).json({
      message: "delete Failed "
    });
  }
};
const quiz = (req, res, next) => {
  try {
    Quiz.deleteOne({ sessionParent: req.params.id }, next);
  } catch (err) {
    console.log(err.message);

    return res.status(500).json({
      message: "delete Failed "
    });
  }
};
exports.lesson = lesson;
exports.session = session;
exports.quiz = quiz;
