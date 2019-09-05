const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, require: true },
  username: { type: String, default: null },
  password: { type: String, default: null },
  email: { type: String, default: null },
  name: { type: String, require: true },
  phoneNumber: { type: String, default: null },
  gender: { type: String, enum: ["man", "woman"], default: "man" },
  role: { type: String, default: "teacher" },
  confirmed: { type: Boolean, default: true },
  nationalCode: { type: String, default: null },
  date_jalali: { type: Object, default: null },
  date: { type: mongoose.Schema.Types.Date, default: Date.now },
  reg_lessons: [
    {
      title: { type: String, default: null },
      lessonId: { type: mongoose.Schema.Types.ObjectId, require: true },
      reg_sessions: [
        {
          title: { type: String, require: true },
          sessionId: { type: mongoose.Schema.Types.ObjectId, require: true },
          score:{ type: Number, default: null },
          tryCount:{ type: Number, default: 0 },
          anotherChanceDate:{ type: mongoose.Schema.Types.Date, default: null },
          date:{ type: mongoose.Schema.Types.Date, default: null },
          passed:{type:Boolean,default:false}

        }
      ]
    }
  ]
});

module.exports = mongoose.model("User", userSchema);
//default null for testing
