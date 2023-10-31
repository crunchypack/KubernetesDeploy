/*Schema for movies */
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

var messageSchema = new Schema({
  title: String,
  ingredients: String,
  website: {
    type: String,
    unique: true
  }
});

module.exports = mongoose.model("messages", messageSchema);
