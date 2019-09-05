const mongoose=require('mongoose')
const teacherSchema=mongoose.Schema({
    _id:{type:mongoose.Schema.Types.ObjectId,require:true},
    username:{type:String,default: null},
    password:{type:String,default: null},
    email:{type:String,default: null},
    name:{type:String,require:true},
    phoneNumber:{type:String,default: null},
    gender:{type:String,enum:["man","woman"],default: "man"},
    role:{type:String,default:"teacher"},
    confirmed:{type:Boolean,default:true},
    nationalCode:{type:String,default:null},
    date_jalali:{type:Object , default: null},
    date:{type:mongoose.Schema.Types.Date , default: Date.now},

})

module.exports=mongoose.model('Teacher',teacherSchema)
//default null for testing