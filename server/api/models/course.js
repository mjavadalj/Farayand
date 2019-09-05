const mongoose=require('mongoose')
const courseSchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    title:{type:String,require:true},
    content:{type:String,default:null},
    date_jalali:{type:Object , default: null},
    date:{type:mongoose.Schema.Types.Date , default: Date.now},
    publishable:{type:Boolean,default:false},
    forAllUniversities:{type:Boolean,default:true},
    lessons:[{type: mongoose.Schema.Types.ObjectId, ref: "Lesson"}]

})
//TODO: teacher and uni
module.exports=mongoose.model('Course',courseSchema)