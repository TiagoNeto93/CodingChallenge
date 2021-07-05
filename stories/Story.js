const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
  id: Number,
  deleted: Boolean,
  type: String,
  by: String,
  time: Number,
  text: String,
  dead: Boolean,
  parent: Number,
  poll: Number,
  kids: [Number],
  url: String,
  score: Number,
  title: String,
  parts: Number,
  descendants: Number
});

schema.set("toJSON", {
  virtuals: true,
  versionKey: false
});

module.exports = mongoose.model("Story", schema);
