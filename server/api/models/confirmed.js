const mongoose=require('mongoose')
const confirmedSchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    nationalcode:{
        type:String,
        unique:true,
        required:true
    }
})

module.exports=mongoose.model('Confirmed',confirmedSchema)