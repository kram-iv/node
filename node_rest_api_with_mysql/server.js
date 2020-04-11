const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const server = express();
const db = require("./app/models");
const corsSettings = {
  originL: "http://localhost:8081"
};
const api = require("./routes/index");

//const api = require("./routes/index");
server.use(cors(corsSettings));
// Parse request of content-type - application/json
server.use(bodyParser.json());
// parse requests of content-type -application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: true }));

server.use("/", api);
//create a simple route
server.get("/", (_req, res) => {
  res.json({
    message:
      "Welcome to node.js rest api application. Created for learning purposes by Vikram Karanth"
  });
});
// set listening ports for request
const port = process.env.PORT || 8080;
server.listen(port, () => {
  console.log("Server running on port : " + port);
});

db.databaseConf.sync();
