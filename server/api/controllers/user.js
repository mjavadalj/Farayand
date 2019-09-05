const mongoose = require("mongoose");
const User = require("../models/user");

const handler = (json, res, code) => {
    res.status(code).json(json);
};

module.exports.addAUser = (req, res) => {
    const user = new User({
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

module.exports.showAllUsers = (req, res) => {
    User.find({}).exec()
        .then(result => {
            handler(result, res, 200)
        })
        .catch(err => {
            handler(err, res, 404)
        })
}
