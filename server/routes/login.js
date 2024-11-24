import express from "express";
//import User from "../mongoConnection.js"; // Ensure the correct file extension is used
//import jwt from "jsonwebtoken";
import { authFunc } from "../authenticationHandler.js";
import login from "./controllers/loginHandler.js";

const loginRoutes = express.Router();
const api = "/api/1/";
loginRoutes.post(api + "login", login);

loginRoutes.get(api + "logout", authFunc, async (req, res, next) => {
  res.clearCookie("access-token");
  console.log("here in logout");
  // res.status(200).redirect("/login");
  res.status(200).send({ message: "logout successfully!" });
});

export default loginRoutes;
