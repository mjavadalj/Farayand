const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const Member=require('../models/member')
const Meeting=require('../models/meeting')
const moment = require('moment-jalaali')
//New meeting
router.post('/newmeeting',(req,res)=>{
    Meeting.stats().exec()
        .then(x=>{
            console.log(x);
        })
        .catch(e=>{
            console.log(e);
            
        })
    const meeting=new Meeting({
        _id:mongoose.Types.ObjectId()
    }).save()
    .then(result=>{
        
        
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        
        handler(err,res,500)
    })
})
//Show all meetings
router.get('/show',(req,res)=>{
    Meeting.find({}).populate('host').exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        
    })
})
//Show last meeting
router.get('/show/last',(req,res)=>{
    Meeting.findOne({}).sort('-date').populate('host').exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        handler(err,res,500)
        
    })
})
//Show a meeting
router.get('/show/:id',(req,res)=>{
    Meeting.findById(req.params.id).populate('host','-loan').exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        
    })
})
//delete all meetings
router.delete('/deleteall',(req,res)=>{
    Meeting.remove({}).exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        
    })
})
//add guest to meeting
router.patch('/add/:id',(req,res)=>{
    Meeting.findByIdAndUpdate(req.params.id,{
        $push:{
           host:req.body.host
        }
    }).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,500)
    })
})
//member records
router.get('/record/:id',(req,res)=>{
    Meeting.aggregate([
        {
            $unwind:{
                path:"$guest",
                // "preserveNullAndEmptyArrays": true
            }
        },
        {
            $match:{"guest.memberId":mongoose.Types.ObjectId(req.params.id)}
        }
    ]).exec()
    .then(result=>{
        result[0].update({"lessons.publishable":false}).exec()
        res.status(200).json(result)
    })
    .catch(err=>{
        handler(err,res,500)
    })
})
//finish a meeting
router.patch('/finish/:id',(req,res)=>{
    Meeting.findByIdAndUpdate(req.params.id,{finished:req.body.finished}).exec()
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