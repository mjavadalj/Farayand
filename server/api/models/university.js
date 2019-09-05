const mongoose=require('mongoose')
const universitySchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    name:{type:String,require:true},
    city:{type:String,require:true},
    state:{type:String,require:true},

})

module.exports=mongoose.model('University',universitySchema)