const mongoose = require("mongoose");
const Confirmed = require("../models/confirmed");
const User = require("../models/user");
const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};
module.exports.add = (req, res) => {
  const confirmed = new Confirmed({
    _id: mongoose.Types.ObjectId(),
    nationalcode: req.body.nationalcode
  })
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.delete = (req, res) => {
  Confirmed.deleteOne({ _id: mong(req.body.id)})
    .exec()
    .then(result => {
      return res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAll = (req, res) => {
  Confirmed.find({})
    .exec()
    .then(result => {
      return res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
