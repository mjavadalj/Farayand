const mongoose=require('mongoose')
const moment = require('moment-jalaali')
const memberSchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    fullname:{type:String,require:true},
    email:{type:String,default:null},
    reg_date_jalaali:{type:Object , default: null},
    jalali:{type:String,require:true},
    
    reg_date:{type:mongoose.Schema.Types.Date , default: Date.now},
    loan:[{
        date_jalaali:{type:Object , default: null},
        date:{type:mongoose.Schema.Types.Date , default: Date.now},
        amount:{type:Number,require:true},
        paid:{type:Number,default:0},
        meeting:{ type: mongoose.Schema.Types.ObjectId, ref: "Meeting", require:true}
    }],
    cash:{type: Number,default:0},
    active:{type:Boolean,default:true}

})

module.exports=mongoose.model('Member',memberSchema)