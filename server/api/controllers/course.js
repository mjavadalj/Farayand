const mongoose = require("mongoose");

const Embed = require("../models/embed");
const moment = require("moment-jalaali");

const handler = (json, res, code) => {
  res.status(code).json(json);
};

module.exports.addCourse = (req, res) => {
  const embed = new Embed({
    _id: mongoose.Types.ObjectId(),
    date_jalali: moment(),
    title: req.body.title,
    content: req.body.content,
    publishable: req.body.publishable,
    creator: req.body.creator
  })
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};

module.exports.showAllCourses = (req, res) => {
  find = {};
  if (req.query.r == "!a") {
    find = {
      publishable: true
    };
  }
  Embed.find(find)
    .skip(parseInt(req.query.skip))
    .limit(parseInt(req.query.limit))
    .select("-lessons.sessions")
    .populate("creator", "name")
    .populate("user", "name")
    // .sort('-date')
    .lean()
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
};
module.exports.courseConut = (req, res) => {
  find = {};
  if (req.query.r == "!a") {
    find = {
      publishable: true
    };
  }
  Embed.find(find)
    .count()
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
};
module.exports.showSingleCourse = (req, res) => {
  Embed.findById(req.body.courseId)
    .select("-lessons")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
};

module.exports.deleteAllCourses = (req, res) => {
  Embed.deleteMany({})
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
};

module.exports.deleteACourse = (req, res) => {
  Embed.deleteOne({ _id: req.body.courseId })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
};

module.exports.editACourse = (req, res) => {
  newItems = {};
  if (req.body.title != undefined) newItems.title = req.body.title;
  if (req.body.content != undefined) newItems.content = req.body.content;
  if (req.body.publishable != undefined)
    newItems.publishable = req.body.publishable;
  if (req.body.forAllUniversities != undefined)
    newItems.forAllUniversities = req.body.forAllUniversities;

  Embed.findByIdAndUpdate(
    req.body.courseId,
    {
      $set: newItems
    },
    { new: true }
  )
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.addTeacherToCourse = (req, res) => {
  Embed.findByIdAndUpdate(
    req.body.courseId,
    {
      $addToSet: {
        user: req.body.teacherId
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.deleteTeacherFromCourse = (req, res) => {
  Embed.findByIdAndUpdate(
    req.body.courseId,
    {
      $pull: {
        user: req.body.teacherId
      }
    },
    { new: true }
  )
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
module.exports.searchCourse = (req, res) => {
  Embed.find({ title: { $regex: req.query.title, $options: "i" } })
    .select("-lessons")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
