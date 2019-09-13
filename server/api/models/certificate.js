const mongoose=require('mongoose')
const certificateSchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    lesson:{type:mongoose.Schema.Types.ObjectId,require:true},
    userId:{type:mongoose.Schema.Types.ObjectId,ref:'User',require:true},
    userName:{type:String,require:true},
    date: { type: mongoose.Schema.Types.Date, default: Date.now }
})

module.exports=mongoose.model('Certificate',certificateSchema)