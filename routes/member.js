const express = require("express");
const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Joi = require("@hapi/joi");
const router = express.Router();
const Member=require('../models/member')
const Meeting=require('../models/meeting')
const moment = require('moment-jalaali')
//New Member
router.post('/newmember',(req,res)=>{
    const member=new Member({
        _id:mongoose.Types.ObjectId(),
        fullname:req.body.fullname,
    }).save()
    .then(result=>{
        
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        
    })
})
//Show all members
router.get('/show',(req,res)=>{
    Member.find({}).exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        
    })
})
//Show all active members
router.get('/show/actives',(req,res)=>{
    Member.find({active:true}).exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        
    })
})
//Show a member
router.get('/show/:id',(req,res)=>{
    Member.findById(req.params.id).exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        
    })
})
//Delete all members
router.delete('/deleteall',(req,res)=>{
    Member.remove({}).exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        console.log(err);
        
    })
})
//delete a member
router.delete('/delete/:id',(req,res)=>{
    Member.remove({_id:req.params.id}).exec()
    .then(result=>{
        res.status(200).json(result)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//group pay cash
router.patch('/cash',(req,res)=>{
    Member.updateMany({_id:{$in:req.body.memberArray}},{$inc:{cash:+req.body.cost}}).exec()
    .then(members=>{
        res.status(200).json(members)
    })
    .catch(err=>{
        handler(err,res,500)
    })
})
//pay cash
router.patch('/cash/:id',(req,res)=>{
    Member.update({_id:{$in:req.params.id}},{$inc:{cash:+req.body.cost}}).exec()
    .then(members=>{
        res.status(200).json(members)
    })
    .catch(err=>{
        handler(err,res,500)
    })
})
//add loan
router.patch('/addloan/:id',(req,res)=>{
    Member.findById(req.params.id).exec()
    .then(member=>{
        if (member.loan[member.loan.length-1]!=undefined && member.loan[member.loan.length-1].paid!=member.loan[member.loan.length-1].amount){
            return handler({message:"وام های قبلی باید تسویه شوند"},res,500)
        }
        member.loan.push({
            date_jalaali:moment(),
            amount:req.body.amount,
            meeting:req.body.meeting
        })
        member.save()
        Meeting.findByIdAndUpdate({_id:req.body.meeting},{$push:{loaner:{
            fullname:req.body.fullname,
            amount:req.body.amount,
            jalali:req.body.jalali,
            memberId:req.params.id
        }}}).exec()
        .then(meeting=>{
            return res.status(200).json({meeting,member})
        })
        .catch(err=>{
            handler(err,res,404)
        })
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//pay loan
router.patch('/payloan/:id',(req,res)=>{
    Member.findById(req.params.id).exec()
    .then(member=>{
        member.loan[member.loan.length-1].paid+=req.body.paid
        const diff=member.loan[member.loan.length-1].paid-member.loan[member.loan.length-1].amount
        if (diff>0){
            member.cash+=diff
            member.loan[member.loan.length-1].paid-=diff
        }
        member.save()
        return res.status(200).json(member)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//active a member
router.patch('/active/:id',(req,res)=>{
    Member.findByIdAndUpdate(req.params.id,{$set:{active:true}}).exec()
    .then(result=>{
        return res.status(200).json(result)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//deactive a member
router.patch('/deactive/:id',(req,res)=>{
    Member.findByIdAndUpdate(req.params.id,{$set:{active:false}}).exec()
    .then(result=>{
        return res.status(200).json(result)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
//loan remaining
router.get('/loan/remain/:id',(req,res)=>{
    Member.findById(req.params.id).exec()
    .then(member=>{
        if (member.loan.length!=0){
            remain=member.loan[member.loan.length-1].amount-member.loan[member.loan.length-1].paid
            console.log(remain);
            
        }
        res.status(200).json(member)
    })
    .catch(err=>{
        handler(err,res,500)
    })
})
//edit member
router.patch('/edit/:id',(req,res)=>{
    Member.findById(req.params.id).exec()
    .then(member=>{
        member.fullname=req.body.fullname
        member.jalali=req.body.jalali
        member.active=req.body.active
        member.save()
        res.status(200).json(member)
    })
    .catch(err=>{
        handler(err,res,404)
    })
})
const handler=(err,res,code)=>{
    res.status(code).json(err.message)
}
module.exports = router;