const Session = require("./session");
const mongoose=require('mongoose')
const lessonSchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    title:{type:String,require:true},
    content:{type:String,default:null},
    date_jalali:{type:Object , default: null},
    date:{type:mongoose.Schema.Types.Date , default: Date.now},
    courseParent:{type:String,default:null},
    publishable:{type:Boolean,default:true},
    sessions:[{type: mongoose.Schema.Types.ObjectId, ref: "Session"}]

})
// function deleteRef(next) {
//     console.log("Lesson id:");
//     console.log(this.getQuery()["_id"]);
//     var lessonParent=this.getQuery()["_id"]
//     Session.deleteOne({lessonParent}, next);
// }
// lessonSchema.pre('deleteOne',deleteRef)
module.exports=mongoose.model('Lesson',lessonSchema)