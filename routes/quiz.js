const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const Quiz=require('../models/quiz')
const moment = require('moment-jalaali')
//Add new quiz
router.post('/add',(req,res)=>{
    const quiz=new Quiz({
        _id:mongoose.Types.ObjectId(),
        date_jalali:moment(),
        duration:req.body.duration,
        minScore:req.body.minScore,
        secondChance:req.body.secondChance
    }).save()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        handler(err,res,500)
    })
})
//Show all quizzes
router.get('/showall',(req,res)=>{
    Quiz.find({}).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//Show a quiz
router.get('/show/:id',(req,res)=>{
    Quiz.findById(req.params.id).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//Delete all quizzes
router.delete('/deleteall',(req,res)=>{
    Quiz.deleteMany({}).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//Delete a quiz
router.delete('/delete/:id',(req,res)=>{
    Quiz.deleteOne({_id:req.params.id}).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//Add question to a quiz
router.patch('/:id/questions/add',(req,res)=>{
    Quiz.findByIdAndUpdate(req.params.id,{
        $push:{
            questions:req.body.question
        }
    }).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{        
        handler(err,res,500)
    })
})
//Delete a question from quiz
router.patch('/:id/questions/delete/:questionId',(req,res)=>{
    Quiz.findByIdAndUpdate(req.params.id,{
        $pull:{
            questions:{
                _id:req.params.questionId
            }
        }
    }).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        console.log(err.message);
        
        handler(err,res,500)
    })
})
//TODO: Delete all questions from quiz
//Edit a question
router.patch('/:id/questions/edit/:questionId',(req,res)=>{
    Quiz.findOneAndUpdate({_id:mongoose.Types.ObjectId(req.params.id),"questions._id":mongoose.Types.ObjectId(req.params.questionId)},{
        $set:{
            "questions.$":req.body.question,
        }
    }).exec()
    .then(result=>{
        handler(result,res,200)
    })
    .catch(err=>{
        handler(err,res,500)
    })
})
//Edit a quiz
router.patch('/edit/:id',(req,res)=>{
    temp={}
    if(req.body.duration) temp.duration=req.body.duration
    if(req.body.minScore) temp.minScore=req.body.minScore
    if(req.body.secondChance) temp.secondChance=req.body.secondChance
    Quiz.findByIdAndUpdate(req.params.id,{
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