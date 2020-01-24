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
    limitation: req.body.limitation,
    publishable: req.body.publishable,
    creator: req.user.userId
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
  find = {
    $and: []
  };
  if (req.user.role != "admin") {
    find.$and.push({ publishable: true });
  }
  if (req.query.select) {
    find.$and.push({ limitation: req.query.select });
  }
  if (req.query.exception) {
    find.$and.push({ limitation: { $ne: req.query.exception } });
  }
  if (find.$and.length == 0) {
    find = {};
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
  find = {
    $and: []
  };
  if (req.user.role != "admin") {
    find.$and.push({ publishable: true });
  }
  if (req.query.select) {
    find.$and.push({ limitation: req.query.select });
  }
  if (find.$and.length == 0) {
    find = {};
  }
  Embed.find(find);
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
  if (req.body.limitation != undefined)
    newItems.limitation = req.body.limitation;

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
        user: req.user.userId
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
        user: req.user.userId
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
  var find = { $and: [{ title: { $regex: req.query.title, $options: "i" } }] };
  if (req.user.role != "admin") {
    find.$and.push({ publishable: true });
  }
  if (req.query.select) {
    find.$and.push({ limitation: req.query.select });
  }
  Embed.find(find)
    .select("-lessons.sessions")
    .populate("creator name")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
};
