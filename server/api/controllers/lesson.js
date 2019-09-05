const mongoose = require("mongoose");
const Lesson = require("../models/lesson");
const Session = require("../models/session");
const moment = require("moment-jalaali");

const handler = (json, res, code) => {
    res.status(code).json(json);
};

module.exports.addLesson = (req, res) => {
    const lesson = new Lesson({
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
}

module.exports.showAllLessons = (req, res) => {
    Lesson.find({})
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 404);
        });
}

module.exports.showSingleLesson = (req, res) => {
    Lesson.findById(req.params.id)
        .populate("sessions")
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 404);
        });
}

module.exports.deleteAllLessons = (req, res) => {
    Lesson.remove({})
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 404);
        });
}

module.exports.deleteALesson = (req, res) => {
    Lesson.deleteOne({ _id: req.params.id })
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 404);
        });
}

module.exports.editLesson = (req, res) => {
    temp = {};
    if (req.body.title) temp.title = req.body.title;
    if (req.body.content) temp.content = req.body.content;
    if (req.body.publishable) temp.publishable = req.body.publishable;
    if (req.body.courseParent) temp.courseParent = req.body.courseParent;
    Lesson.findByIdAndUpdate(req.params.id, {
        $set: temp
    })
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 500);
        });
}

module.exports.addSessionToLesson = (req, res) => {
    Lesson.findOneAndUpdate(
        { _id: req.params.id },
        {
            $addToSet: {
                sessions: req.body.session
            }
        },
        { new: true }
    )
        .exec()
        .then(result => {
            var index = 0;
            if (result.sessions.length != 0) index = result.sessions.length - 1;
            const sessionId = result.sessions[index];
            console.log(sessionId);

            Session.findByIdAndUpdate(sessionId, {
                $set: {
                    lessonParent: req.params.id
                }
            })
                .exec()
                .then()
                .catch(err => handler(err, res, 500));
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 500);
        });
}

module.exports.deleteSessonFromLesson = (req, res) => {
    Lesson.findByIdAndUpdate(req.params.id, {
        $pull: {
            sessions: req.params.sessionId
        }
    })
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            console.log(err.message);

            handler(err, res, 500);
        });
}