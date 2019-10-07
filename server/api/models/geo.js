const mongoose = require("mongoose");
const geoSchema = mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, require: true },
  country: { type: String, require: true },
  province: [
    {
      name: { type: String, require: true },
      city: [
        {
          name: { type: String, require: true }
        }
      ]
    }
  ]
});

module.exports = mongoose.model("Geo", geoSchema);
