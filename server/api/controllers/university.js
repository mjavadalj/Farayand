
const mongoose = require("mongoose");
const University = require('../models/university')
const handler = (json, res, code) => {
    res.status(code).json(json)
}

module.exports.addUniversity = (req, res) => {
    const uni = new University({
        _id: mongoose.Types.ObjectId(),
        city: req.body.city,
        state: req.body.state,
        name: req.body.secondChance
    }).save()
        .then(result => {
            res.status(200).json(result)
        })
        .catch(err => {
            handler(err, res, 500)
        })
}

module.exports.showAllUniversites = (req, res) => {
    University.find({}).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}

module.exports.showSingleUniversity = (req, res) => {
    University.findById(req.params.id).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}

module.exports.deleteAllUniversites = (req, res) => {
    University.remove({}).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}

module.exports.deleteSingleUniversity = (req, res) => {
    University.remove({ _id: req.params.id }).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}

module.exports.editAUniversity = (req, res) => {
    temp = {}
    if (req.body.city) temp.city = req.body.city
    if (req.body.state) temp.state = req.body.state
    if (req.body.name) temp.name = req.body.name
    University.findByIdAndUpdate(req.params.id, {
        $set: temp
    }).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 500)
        })
}