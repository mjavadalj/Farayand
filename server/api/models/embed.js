const mongoose = require("mongoose");
const embedSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, require: true },
  title: { type: String, require: true },
  content: { type: String, default: null },
  date_jalali: { type: Object, default: null },
  date: { type: mongoose.Schema.Types.Date, default: Date.now },
  publishable: { type: Boolean, default: false },
  forAllUniversities: { type: Boolean, default: true },
  user:[{type: mongoose.Schema.Types.ObjectId,ref:'User'}],
  creator:{type: mongoose.Schema.Types.ObjectId,ref:'User', require: true},
  lessons: [
    {
      title: { type: String, require: true },
      content: { type: String, default: null },
      date_jalali: { type: Object, default: null },
      date: { type: mongoose.Schema.Types.Date, default: Date.now },
      publishable: { type: Boolean, default: true },
      sessions: [
        {
          title: { type: String, require: true },
          userQCount: { type: Number, require: true },
          content: { type: String, default: null },
          date_jalali: { type: Object, default: null },
          quizDate: { type: mongoose.Schema.Types.Date, default: Date.now },
          publishable: { type: Boolean, default: false },
          duration: { type: Number, default: null  },
          minScore: { type: Number, default: null },
          secondChance: { type: String, default: null },
          questions: [
            {
              text: { type: String, require: true },
              option_1:{
                text:{ type: String, require: true },
                correct:{ type: Boolean, default: null },
              },
              option_2:{
                text:{ type: String, require: true },
                correct:{ type: Boolean, default: null },
              },
              option_3:{
                text:{ type: String, require: true },
                correct:{ type: Boolean, default: null },
              },
              option_4:{
                text:{ type: String, require: true },
                correct:{ type: Boolean, default: null },
              },
            }
          ],
          files: [
            {
              name: { type: String, default: null },
              type: { type: String, default: null },
              size: { type: String, default: null }
            }
          ]
        }
      ]
    }
  ]
});

module.exports = mongoose.model("Embed", embedSchema);
