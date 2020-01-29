const User = require("../models/user");
module.exports.isAdmin = (req, res, next) => {
  User.findById(req.user.userId)
    .exec()
    .then(user => {
      if (!user || user.role != "admin") {
        return res.status(401).json({
          message: "not admin , you're not allowed"
        });
      } else {
        next();
      }
    })
    .catch(err => {
      return res.status(400).json({
        message: "not admin , you're not allowed"
      });
    });
};

module.exports.isTeacher = (req, res, next) => {
  User.findById(req.user.userId)
    .exec()
    .then(user => {
      if (!user || user.role != "teacher") {
        return res.status(401).json({
          message: "not teacher , you're not allowed"
        });
      } else {
        next();
      }
    })
    .catch(err => {
      return res.status(400).json({
        message: "not teacher , you're not allowed"
      });
    });
};
