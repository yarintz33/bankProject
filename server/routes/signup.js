import express from "express";
import jwt from "jsonwebtoken";
// import bcrypt from "bcrypt";
import mongoose from "mongoose";

import { User, UnAuthUser } from "../mongoSchemas.js";

import { authFunc, registrationAuth } from "../authentication.js";

const singupRoutes = express.Router();

const saltRounds = 10;

const api = "/api/1/signup/";

singupRoutes.post(api + "confirmation", registrationAuth, async (req, res) => {
  const bodyCode = req.body.code;
  console.log(bodyCode);
  const { email, firstName, lastName, password, phone, code } =
    await UnAuthUser.findById(req.user.userId).exec();
  if (code != bodyCode) {
    return res.status(406).send("incorrect code");
  }

  const newUser = new User({
    email,
    firstName,
    lastName,
    password,
    phone,
    transaction: new Array(),
    balance: 0,
  });

  await newUser.save();
  await UnAuthUser.deleteOne({ _id: req.user.userId });

  res.status(200).send("ok body!");
});

singupRoutes.route(api + "refresh-code").post(async (req, res, next) => {});

export default singupRoutes;
