const mongoose = require("mongoose");
const Quiz = require('../models/quiz');
const moment = require('moment-jalaali');

const handler = (json, res, code) => {
    res.status(code).json(json)
}

module.exports.add = (req, res) => {
    const quiz = new Quiz({
        _id: mongoose.Types.ObjectId(),
        date_jalali: moment(),
        duration: req.body.duration,
        minScore: req.body.minScore,
        secondChance: req.body.secondChance
    }).save()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            handler(err, res, 500)
        })
}



module.exports.showAllQuizzes = (req, res) => {
    Quiz.find({}).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}





module.exports.showSingleQuiz = (req, res) => {
    Quiz.findById(req.params.id).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}





module.exports.deleteAllQuizzes = (req, res) => {
    Quiz.deleteMany({}).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}





module.exports.deleteSingleQuize = (req, res) => {
    Quiz.deleteOne({ _id: req.params.id }).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}




module.exports.addQuestionsToAQuiz = (req, res) => {
    Quiz.findByIdAndUpdate(req.params.id, {
        $push: {
            questions: req.body.question
        }
    }).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 500)
        })
}

module.exports.deleteAQuestionOfAQuiz = (req, res) => {
    Quiz.findByIdAndUpdate(req.params.id, {
        $pull: {
            questions: {
                _id: req.params.questionId
            }
        }
    }).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            console.log(err.message);

            handler(err, res, 500)
        })
}

module.exports.editAQuestion = (req, res) => {
    Quiz.findOneAndUpdate({ _id: mongoose.Types.ObjectId(req.params.id), "questions._id": mongoose.Types.ObjectId(req.params.questionId) }, {
        $set: {
            "questions.$": req.body.question,
        }
    }).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 500)
        })
}

module.exports.editAQuiz = (req, res) => {
    temp = {}
    if (req.body.duration) temp.duration = req.body.duration
    if (req.body.minScore) temp.minScore = req.body.minScore
    if (req.body.secondChance) temp.secondChance = req.body.secondChance
    Quiz.findByIdAndUpdate(req.params.id, {
        $set: temp
    }).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 500)
        })
}