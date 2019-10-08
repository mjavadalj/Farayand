const mongoose = require("mongoose");
const Geo = require("../models/geo");
const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};
const Cid = "5d9b6c7c7fd485019064660e";
module.exports.addCountry = (req, res) => {
  const geo = new Geo({
    _id: mongoose.Types.ObjectId(),
    country: req.body.country
  })
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.addProvince = (req, res) => {
  id = Cid;
  Geo.findByIdAndUpdate(
    id,
    {
      $addToSet: {
        province: {
          name: req.body.name
        }
      }
    },
    {
      new: true
    }
  )
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.addCity = (req, res) => {
  find = {
    $and: [{ _id: Cid }, { "province._id": mong(req.body.provinceId) }]
  };
  Geo.findOneAndUpdate(
    find,
    {
      $addToSet: {
        "province.$.city": {
          name: req.body.name
        }
      }
    },
    {
      new: true
    }
  )
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.deleteAll = (req, res) => {
  Geo.remove({})
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
