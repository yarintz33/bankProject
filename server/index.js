// var express = require("express");
// const jwt = require("jsonwebtoken");

// //const User = require("./userModel");
// const mongoose = require("mongoose");

// var app = express();
// const cors = require("cors");
// app.use(cors());

// app.use(express.json());
// //Middleware to parse URL-encoded data (if needed)
// app.use(express.urlencoded({ extended: true }));

// app.get("/", function (req, res) {
//   res.send("Hello World");
// });

// app.use(require("./routes/users"));

// var server = app.listen(5000, function () {
//   console.log("Express App running at http://localhost:5000/ !");
// });

import express from "express";
import cors from "cors";
import userRoutes from "./routes/users.js";
import signupRoutes from "./routes/signup.js";
import cookieparser from "cookie-parser";
// import sgMail from "./nodeMailer.js";
import sgMail from "@sendgrid/mail";
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const app = express();
// sgMail.send();
app.use(cookieparser());
app.use(cors());
app.use(express.json());

// Middleware to parse URL-encoded data (if needed)
app.use(express.urlencoded({ extended: true }));

// Root route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Use user routes
app.use(userRoutes);
app.use(signupRoutes);

// Start the server
const server = app.listen(5000, () => {
  console.log("Express App running at http://localhost:5000/ !");
});

export default server;
