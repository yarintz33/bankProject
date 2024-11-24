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
import cookieparser from "cookie-parser";
import loginRoutes from "./routes/login.js";
// import sgMail from "./nodeMailer.js";
import sgMail from "@sendgrid/mail";
import authenticationRoutes from "./routes/authentications.js";
// console.log("sendgrid key..");
// console.log(process.env.SENDGRID_API_KEY);
await sgMail.setApiKey(process.env.SENDGRID_API_KEY2);

const app = express();
// sgMail.send();
app.use(cookieparser());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);
app.use(express.json());

// Middleware to parse URL-encoded data (if needed)
app.use(express.urlencoded({ extended: true }));

// Use user routes
app.use(userRoutes);
app.use(loginRoutes);
app.use(authenticationRoutes);

// Start the server
const server = app.listen(5000, () => {
  console.log("Express App running at http://localhost:5000/ !");
});

export default server;
