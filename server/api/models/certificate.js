const mongoose=require('mongoose')
const certificateSchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    teacherId:{type:mongoose.Schema.Types.ObjectId,require:true},
    userId:{type:mongoose.Schema.Types.ObjectId,require:true},
    courseId:{type:mongoose.Schema.Types.ObjectId,require:true},
    lessonId:{type:mongoose.Schema.Types.ObjectId,require:true},
    teacherName:{type:String,require:true},
    userName:{type:String,require:true},
    courseTitle:{type:String,require:true},
    lessonTitle:{type:String,require:true},
    score:{type:String,require:true},
    date: { type: mongoose.Schema.Types.Date, default: Date.now }
})

module.exports=mongoose.model('Certificate',certificateSchema)