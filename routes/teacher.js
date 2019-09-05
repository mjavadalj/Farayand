const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const University = require("../models/university");
const Teacher = require("../models/teacher");
const moment = require("moment-jalaali");
//new Teacher
router.post("/add", (req, res) => {
  const teacher = new Teacher({
    _id: mongoose.Types.ObjectId(),
    name:req.body.name
  })
    .save()
    .then(result => {
      res.status(200).json(result);
    })
    .catch(err => {
      handler(err, res, 500);
    });
});

router.get('/showall',(req,res)=>{
    Teacher.find({}).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
const handler = (json, res, code) => {
  res.status(code).json(json);
};
module.exports = router;
