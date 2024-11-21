import express from "express";
import User from "../mongoConnection.js"; // Ensure the correct file extension is used
import jwt from "jsonwebtoken";
import secretKey from "../secretKey.js";

const loginRoute = express.Router();

loginRoute.route("/login").post(async (req, res, next) => {
  const { email, password } = req.body;
});
