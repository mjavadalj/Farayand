const mongoose = require("mongoose");
const Geo = require("../models/geo");
const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};
const Cid = "5d9c1abe52cf8b11e4534099";
module.exports.showAll = (req, res) => {
  Geo.find()
    .sort("name")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAllProvinces = (req, res) => {
  Geo.findOne()
    .select("-province.city")
    .exec()
    .then(result => {
      result.province.sort(function(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      handler(result.province, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.showAllCitiesOfProvince = (req, res) => {
  Geo.aggregate([
    {
      $unwind: "$province"
    },
    {
      $match: {
        "province._id": mong(req.body.provinceId)
      }
    },
    {
      $project: {
        city: "$province.city"
      }
    }
  ])
    .exec()
    .then(result => {
      result[0].city.sort(function(a, b) {
        if (a.name < b.name) {
          return -1;
        }
        if (a.name > b.name) {
          return 1;
        }
        return 0;
      });
      handler(result[0].city, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.addCountry = (req, res) => {
  const geo = new Geo({
    //TODO: handle this
    _id: mong("5d9c1abe52cf8b11e4534099"),
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
  find = {
    $and: [{ _id: Cid }, { "province.name": { $ne: req.body.name } }]
  };
  Geo.findOneAndUpdate(
    find,
    {
      $push: {
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
      handler(result.province[result.province.length - 1], res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.deleteProvince = (req, res) => {
  id = Cid;
  Geo.findByIdAndUpdate(
    id,
    {
      $pull: {
        province: {
          _id: mong(req.body.provinceId)
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
module.exports.editProvince = (req, res) => {
  find = {
    $and: [{ _id: Cid }, { "province._id": mong(req.body.provinceId) }]
  };
  Geo.findOneAndUpdate(
    find,
    {
      $set: {
        "province.$": {
          name: req.body.name,
          _id: mong(req.body.provinceId)
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
    $and: [
      { _id: Cid },
      { "province._id": mong(req.body.provinceId) },
      { "province.city.name": { $ne: req.body.name } }
    ]
  };
  Geo.findOneAndUpdate(
    find,
    {
      $push: {
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
module.exports.deleteCity = (req, res) => {
  find = {
    $and: [{ "province.city._id": mong(req.body.cityId) }]
  };
  Geo.findOneAndUpdate(
    find,
    {
      $pull: {
        "province.$.city": {
          _id: mong(req.body.cityId)
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
module.exports.editCity = (req, res) => {
  find = {
    "province.city._id": mong(req.body.cityId)
  };
  Geo.findOneAndUpdate(
    find,
    {
      $set: {
        "province.$[].city.$[elem]": {
          _id: mong(req.body.cityId),
          name: req.body.name
        }
      }
    },
    {
      new: true,
      arrayFilters: [{ "elem._id": mong(req.body.cityId) }]
    }
  )
    .exec()
    .then(result => {
      if (result) {
        handler({name:req.body.name,_id:req.body.cityId}, res, 200);
      } else {
        handler({mes:"nack"}, res, 500);
      }
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
