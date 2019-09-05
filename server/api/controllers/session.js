
const mongoose = require("mongoose");
const Quiz = require("../models/quiz");
const Session = require("../models/session");
const moment = require("moment-jalaali");

const handler = (json, res, code) => {
    res.status(code).json(json);
};


module.exports.addASession = (req, res) => {
    const session = new Session({
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

module.exports.showAllSessions = (req, res) => {
    Session.find({})
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 404);
        });
}


module.exports.showSingleSession = (req, res) => {
    Session.findOne({ _id: req.params.id })
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 404);
        });
}

module.exports.deleteAllSessons = (req, res) => {
    Session.deleteMany({})
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 404);
        });
}


module.exports.deleteSingleSession = (req, res) => {
    Session.deleteOne({ _id: req.params.id })
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 404);
        });
}

module.exports.deleteASessionWithQuiz = (req, res) => {
    Session.deleteOne({ _id: req.params.id })
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 404);
        });
}


module.exports.editASession = (req, res) => {
    temp = {};
    if (req.body.title) temp.title = req.body.title;
    if (req.body.content) temp.content = req.body.content;
    if (req.body.publishable) temp.publishable = req.body.publishable;
    Session.findByIdAndUpdate(req.params.id, {
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


module.exports.setAQuizToASession = (req, res) => {
    Session.findByIdAndUpdate(req.params.id, {
        $set: {
            quiz: req.body.quiz
        }
    })
        .exec()
        .then(result => {
            Quiz.findByIdAndUpdate(req.body.quiz, {
                $set: {
                    sessionParent: req.params.id
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

module.exports.deleteQuizeOfASession = (req, res) => {
    Session.findByIdAndUpdate(req.params.id, {
        $set: {
            quiz: undefined
        }
    })
        .exec()
        .then(result => {
            handler(result, res, 200);
        })
        .catch(err => {
            handler(err, res, 500);
        });
}
