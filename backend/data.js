// /backend/data.js
const mongoose = require("mongoose");
var uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    id: {type: String, required: true, unique: true},
    ratingWifi: Number,
    ratingPower: Number,
    ratingFood: Number,
    placesData: Object,
    latitude: Number,
    longitude: Number,
  },
  { timestamps: true }
);
DataSchema.plugin(uniqueValidator);
// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Data", DataSchema);