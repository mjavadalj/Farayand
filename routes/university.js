const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const University=require('../models/university')
const moment = require('moment-jalaali')
//Add new university
router.post('/add',(req,res)=>{
    const uni=new University({
        _id:mongoose.Types.ObjectId(),
        city:req.body.city,
        state:req.body.state,
        name:req.body.secondChance
    }).save()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        handler(err,res,500)
    })
})
//Show all universites
router.get('/showall',(req,res)=>{
    University.find({}).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//Show a university
router.get('/show/:id',(req,res)=>{
    University.findById(req.params.id).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//Delete all universites
router.delete('/deleteall',(req,res)=>{
    University.remove({}).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//Delete a university
router.delete('/delete/:id',(req,res)=>{
    University.remove({_id:req.params.id}).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//Edit a university
router.patch('/edit/:id',(req,res)=>{
    temp={}
    if(req.body.city) temp.city=req.body.city
    if(req.body.state) temp.state=req.body.state
    if(req.body.name) temp.name=req.body.name
    University.findByIdAndUpdate(req.params.id,{
        $set:temp
    }).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,500)
    })
})
const handler=(json,res,code)=>{
    res.status(code).json(json)
}
module.exports = router;