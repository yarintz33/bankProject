var express = require("express");
const jwt = require("jsonwebtoken");

//const User = require("./userModel");
const mongoose = require("mongoose");

var app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
//Middleware to parse URL-encoded data (if needed)
app.use(express.urlencoded({ extended: true }));

app.get("/", function (req, res) {
  res.send("Hello World");
});

app.use(require("./routes/users"));

var server = app.listen(5000, function () {
  console.log("Express App running at http://localhost:5000/ !");
});
