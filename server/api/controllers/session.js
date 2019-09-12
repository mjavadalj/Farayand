const mongoose = require("mongoose");
const Embed = require("../models/embed");
const moment = require("moment-jalaali");


const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};
const editItems = (req, text = "") => {
  json = {};
  if (req.body.title != undefined) json[`${text}title`] = req.body.title;
  if (req.body.duration != undefined)
    json[`${text}duration`] = req.body.duration;
  if (req.body.minScore != undefined)
    json[`${text}minScore`] = req.body.minScore;
  if (req.body.content != undefined) json[`${text}content`] = req.body.content;
  if (req.body.secondChance != undefined)
    json[`${text}secondChance`] = req.body.secondChance;
  if (req.body.publishable != undefined)
    json[`${text}publishable`] = req.body.publishable;
  if (req.body.forAllUniversities != undefined)
    json[`${text}forAllUniversities`] = req.body.forAllUniversities;
  return json;
};

module.exports.addASession = (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(find, {
    $push: {
      "lessons.$.sessions": req.body.session
    }
  },{new:true})
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};

module.exports.showAllSessions = (req, res) => {

    find = {
      $and:[
        {_id: mong(req.body.courseId)},
        {"lessons._id": mong(req.body.lessonId)}
      ]
        
      };
      Embed.aggregate([
        {
          $unwind: {
            path: "$lessons",
            includeArrayIndex: "index"
            // "preserveNullAndEmptyArrays": true
          }
        },
        {
          $match: find
        }
      ])
        // sort('-lessons.date')
        .exec()
        .then(result => {
          handler(result[0], res, 200);
        })
        .catch(err => {
          handler(err, res, 200);
        });

};

module.exports.showSingleSession = (req, res) => {
  find = {
    _id: mongoose.Types.ObjectId(req.body.courseId),
    "lessons._id": mongoose.Types.ObjectId(req.body.lessonId),
    "lessons.sessions._id": mongoose.Types.ObjectId(req.body.sessionId)
  };
  Embed.aggregate([
    {
      $unwind: {
        path: "$lessons",
        includeArrayIndex: "index"
        // "preserveNullAndEmptyArrays": true
      }
    },
    {
      $unwind: {
        path: "$lessons.sessions",
        includeArrayIndex: "index"
        // "preserveNullAndEmptyArrays": true
      }
    },
    {
      $match: find
    }
  ])
    .exec()
    .then(result => {
      handler(result[0].lessons.sessions.questions, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
};

module.exports.deleteAllSessons = (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(find, {
    $set: {
      "lessons.$.sessions": []
    }
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};

module.exports.deleteSingleSession = (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(find, {
    $pull: {
      "lessons.$.sessions": {
        _id: req.body.sessionId
      }
    }
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};

module.exports.editASession = (req, res) => {
  newItems = editItems(req, "lessons.$[].sessions.$[elem].");

  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId,
    "lessons.sessions._id": mong(req.body.sessionId)
  };
  Embed.findOneAndUpdate(
    find,
    {
      $set: newItems
    },
    {
      new: true,
      arrayFilters: [{ "elem._id": mong(req.body.sessionId) }]
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


module.exports.addFile = (req, res) => {
  console.log(req.file.mimetype, '\n', req.file)
}