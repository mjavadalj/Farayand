const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, require: true },
  username: { type: String, default: null },
  password: { type: String, default: null },
  email: { type: String, default: null },
  name: { type: String, require: true },
  phoneNumber: { type: String, default: null },
  gender: { type: String, enum: ["man", "woman"], default: "man" },
  role: { type: String,enum: ["teacher", "student","admin"], default: "teacher" },
  confirmed: { type: Boolean, default: true },
  nationalCode: { type: String, default: null },
  date_jalali: { type: Object, default: null },
  date: { type: mongoose.Schema.Types.Date, default: Date.now },
  university: [{type: mongoose.Schema.Types.ObjectId, ref:'University' }],
  reg_lessons: [
    {
      courseTitle: { type: String, require: true },
      lessonTitle: { type: String, require: true },
      teacherName: { type: String, require: true },
      sessionLength: { type: Number, require: true },
      lessonId: { type: mongoose.Schema.Types.ObjectId, require: true },
      courseId: { type: mongoose.Schema.Types.ObjectId, require: true },
      teacherId: { type: mongoose.Schema.Types.ObjectId, require: true },
      date:{ type: mongoose.Schema.Types.Date, default: Date.now },
      finalScore:{ type: Number, default: null },
      passed:{type:Boolean,default:false},
      reg_sessions: [
        {
          title: { type: String, require: true },
          sessionId: { type: mongoose.Schema.Types.ObjectId, require: true },
          score:{ type: Number, default: null },
          tryCount:{ type: Number, default: 0 },
          anotherChanceDate:{ type: mongoose.Schema.Types.Date, default: null },
          date:{ type: mongoose.Schema.Types.Date, default: Date.now },
          passed:{type:Boolean,default:false}

        }
      ]
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
//default null for testing
//TODO: add sessionLength to reg_lesson
