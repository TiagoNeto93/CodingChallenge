const config = require("config");
const database = config.get("database");
const mongoose = require("mongoose");
const connectionOptions = {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
};
mongoose.connect(
  process.env.MONGODB_URI || database.connectionString,
  connectionOptions
);
mongoose.Promise = global.Promise;

module.exports = {
  Story: require("../stories/Story")
};
