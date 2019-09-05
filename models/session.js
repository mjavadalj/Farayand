const Quiz=require('./quiz')
const mongoose=require('mongoose')
const sessionSchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    title:{type:String,require:true},
    content:{type:String,default:null},
    date_jalali:{type:Object , default: null},
    date:{type:mongoose.Schema.Types.Date , default: Date.now},
    publishable:{type:Boolean,default:false},
    lessonParent:{type:String,default:null},
    quiz:{type: mongoose.Schema.Types.ObjectId, ref: "Quiz"},
    files:[{
        name:{type:String,default:null},
        type:{type:String,default:null},
        size:{type:String,default:null}
    }]

})
// function deleteRef(next) {
    
    
//     console.log("Session Id");
//     console.log(this.getQuery());
    
    
//     // Quiz.deleteOne({ sessionParent: this.getQuery()["_id"] }, next);
// }
// sessionSchema.pre('deleteOne',deleteRef)
module.exports=mongoose.model('Session',sessionSchema)