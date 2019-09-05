const mongoose = require("mongoose");
const Teacher = require("../models/teacher");

const handler = (json, res, code) => {
    res.status(code).json(json);
};

module.exports.addATeacher = (req, res) => {
    const teacher = new Teacher({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name
    })
        .save()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            handler(err, res, 500);
        });
}

module.exports.showAllTeacher = (req, res) => {
    Teacher.find({}).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}
