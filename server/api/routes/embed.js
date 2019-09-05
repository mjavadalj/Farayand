const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Embed = require("../models/embed");
const moment = require("moment-jalaali");
//TODO: LEAN()
/* COURSE*/
//add new embed course
router.post("/course/add", (req, res) => {
  const embed = new Embed({
    _id: mongoose.Types.ObjectId(),
    date_jalali: moment(),
    title: req.body.title,
    content: req.body.content,
    publishable: req.body.publishable
  })
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//Show all embed courses
router.get("/course/showall", (req, res) => {
  Embed.find({})
    .select("lessons")
    .lean()
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Show an embed course
router.get("/course/show/", (req, res) => {
  Embed.findById(req.body.courseId)
    .select("-lessons")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Delete all embed courses
router.delete("/course/deleteall", (req, res) => {
  Embed.remove({})
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//Delete an embed course
router.delete("/course/delete", (req, res) => {
  Embed.remove({ _id: req.body.courseId })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 404);
    });
});
//edit an embed course
router.patch("/course/edit", (req, res) => {
  newItems = {};
  if (req.body.title != undefined) newItems.title = req.body.title;
  if (req.body.content != undefined) newItems.content = req.body.content;
  if (req.body.publishable != undefined)
    newItems.publishable = req.body.publishable;
  if (req.body.forAllUniversities != undefined)
    newItems.forAllUniversities = req.body.forAllUniversities;

  Embed.findByIdAndUpdate(req.body.courseId, {
    $set: newItems
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
/*LESSON*/
//show all lessons
router.get("/course/lesson/showall", (req, res) => {
  Embed.findById(req.body.courseId)
    .select("-lessons.sessions")
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//show a lesson
router.get("/course/lesson/show", (req, res) => {
  find = {
    _id: mongoose.Types.ObjectId(req.body.courseId),
    "lessons._id": mongoose.Types.ObjectId(req.body.lessonId)
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
    .lean()
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
});
//add lesson
router.patch("/course/lesson/add", (req, res) => {
  Embed.findByIdAndUpdate(req.body.courseId, {
    $push: {
      lessons: req.body.lesson
    }
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//edit a lesson
router.patch("/course/lesson/edit", (req, res) => {
  newItems = editItems(req, "lessons.$.");
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(find, {
    $set: newItems
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//delete a lesson
router.patch("/course/lesson/delete", (req, res) => {
  find = {
    _id: req.body.courseId
  };
  Embed.findOneAndUpdate(find, {
    $pull: {
      lessons: {
        _id: req.body.lessonId
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
});
//delete all lessons
router.patch("/course/lesson/deleteall", (req, res) => {
  find = {
    _id: req.body.courseId
  };
  Embed.findOneAndUpdate(find, {
    $set: {
      lessons: []
    }
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
/* SESSION */
//show all sessions
router.get("/course/lesson/session/showall", (req, res) => {
  find = {
    _id: mong(req.body.courseId),
    "lessons._id": mong(req.body.lessonId)
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
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
});
//show a session || show all questions
router.get("/course/lesson/session/show", (req, res) => {
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
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 200);
    });
});
//add session
router.patch("/course/lesson/session/add", (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId
  };
  Embed.findOneAndUpdate(find, {
    $push: {
      "lessons.$.sessions": req.body.session
    }
  })
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
//edit a session
router.patch("/course/lesson/session/edit", (req, res) => {
  newItems = editItems(req, "lessons.$[].sessions.$[elem].");

  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId,
    "lessons.sessions._id": mong(req.body.sessionId)
  };
  Embed.updateOne(
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
});
//delete a session
router.patch("/course/lesson/session/delete", (req, res) => {
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
});
//delete all sessions
router.patch("/course/lesson/session/deleteall", (req, res) => {
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
});
/*QUESTION */
//add a question
router.patch("/course/lesson/session/question/add", (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId,
    "lessons.sessions._id": mong(req.body.sessionId)
  };
  Embed.updateOne(
    find,
    {
      $push: {
        "lessons.$[].sessions.$[elem].questions": req.body.question
      }
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
});
//delete a question
router.patch("/course/lesson/session/question/delete", (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId,
    "lessons.sessions._id": mong(req.body.sessionId),
    "lessons.sessions.questions._id": mong(req.body.questionId)
  };
  Embed.updateOne(
    find,
    {
      $pull: {
        "lessons.$[].sessions.$[elem].questions": {
          _id: req.body.questionId
        }
      }
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
});
//delete all questions
router.patch("/course/lesson/session/question/deleteall", (req, res) => {
  find = {
    _id: req.body.courseId,
    "lessons._id": req.body.lessonId,
    "lessons.sessions._id": mong(req.body.sessionId)
  };
  Embed.updateOne(
    find,
    {
      $set: {
        "lessons.$[].sessions.$[elem].questions": []
      }
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
});
//edit a question
router.patch("/course/lesson/session/question/edit", (req, res) => {
  newQuestion = questionItems(req, "lessons.$[].sessions.$[].questions.$[elem].")
  find = {
    // _id: req.body.courseId,
    // "lessons._id": req.body.lessonId,
    // "lessons.sessions._id": mong(req.body.sessionId),
    "lessons.sessions.questions._id": mong(req.body.questionId)
  };
  Embed.updateOne(
    find,
    {
      $set: newQuestion
    },
    {
      new: true,
      arrayFilters: [{ "elem._id": mong(req.body.questionId) }]
    }
  )
    .exec()
    .then(result => {
      handler(result, res, 200);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});
const handler = (json, res, code) => {
  res.status(code).json(json);
};
const mong = id => {
  return mongoose.Types.ObjectId(id);
};
const editItems = (req, text = "") => {
  json = {};
  if (req.body.title) json[`${text}title`] = req.body.title;
  if (req.body.duration) json[`${text}duration`] = req.body.duration;
  if (req.body.minScore) json[`${text}minScore`] = req.body.minScore;
  if (req.body.content) json[`${text}content`] = req.body.content;
  if (req.body.secondChance)
    json[`${text}secondChance`] = req.body.secondChance;
  if (req.body.publishable) json[`${text}publishable`] = req.body.publishable;
  if (req.body.forAllUniversities)
    json[`${text}forAllUniversities`] = req.body.forAllUniversities;
  return json;
};
const questionItems = (req, text = "") => {
  json = {};
  if (req.body.text) json[`${text}text`] = req.body.text;
  if (req.body.option_1) json[`${text}option_1`] = req.body.option_1;
  if (req.body.option_2) json[`${text}option_2`] = req.body.option_2;
  if (req.body.option_3) json[`${text}option_3`] = req.body.option_3;
  if (req.body.option_4) json[`${text}option_4`] = req.body.option_4;
  if (req.body.correctAnswer)
    json[`${text}correctAnswer`] = req.body.correctAnswer;
  return json;
};
module.exports = router;
