require("rootpath")();
const express = require("express");
const app = express();
const errorHandler = require("./_helpers/error-handler");
const config = require("config");
const serverApi = config.get("server");

// api routes
app.use("/api/stories", require("./stories/controller"));
// global error handler
app.use(errorHandler);

// start server
const port =
  process.env.NODE_ENV === "production" ? process.env.PORT || 80 : +serverApi.port;
const server = app.listen(port, function () {
  console.log("Server listening on port " + port);
});
