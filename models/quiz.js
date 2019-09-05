const mongoose=require('mongoose')
const quizSchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    date_jalali:{type:Object , default: null},
    date:{type:mongoose.Schema.Types.Date , default: Date.now},
    duration:{type:Number,require:true},
    minScore:{type:Number,default:70},
    sessionParent:{type:String,default:null},
    secondChance:{type:String,require:true},
    questions:[{
        text:{type:String,require:true},
        option_1:{type:String,require:true},
        option_2:{type:String,require:true},
        option_3:{type:String,require:true},
        option_4:{type:String,require:true},
        correctAnswer:{type:String,require:true}
    }]
})

module.exports=mongoose.model('Quiz',quizSchema)