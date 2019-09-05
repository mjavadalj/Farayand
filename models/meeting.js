const mongoose = require("mongoose");
const moment = require("moment-jalaali");
const meetingSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, require: true },
  host: [{ type: mongoose.Schema.Types.ObjectId, ref: "Member"}]
});

module.exports = mongoose.model("Meeting", meetingSchema);
