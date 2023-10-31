/*Schema for movies */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var movieSchema = new Schema({
  title:{ type:String, index:true},
  year: Number,
  length: Number,
  desc: String,
  director:[
    {
      type:String,
      index:true
    }
  ] ,
  genre: [
    {
      type: String
    }
  ],
  starring: [
    {
      type: String,
      index: true
    }
  ],
  available: [
    {
      type: String
    }
  ],
  url: String
});

module.exports = mongoose.model("movies", movieSchema);
