import express from "express";
import jwt from "jsonwebtoken";
//import cookieparser from 'cookie-parser';
import bodyParser from "body-parser";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import sendEmail from "../nodeMailer.js";

import { User, UnAuthUser } from "../mongoSchemas.js";
import { authFunc, registrationAuth, refreshAuth } from "../authentication.js";

const usersRoutes = express.Router();

const saltRounds = 10;

const api = "/api/users/";

usersRoutes.post(api + "refresh", refreshAuth, async (req, res, next) => {
  if (req.cookies?.["refresh-auth_token"]) {
    const refreshToken = req.cookies?.["refresh-auth_token"];

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(406).json({ message: "Unauthorized" });
      } else {
        console.log("decoded: " + decoded);
        const accessToken = jwt.sign(
          {
            userId: decoded.userId,
            email: decoded.email,
          },
          process.env.SECRET_KEY_USERS,
          {
            expiresIn: "10m",
          }
        );

        res.cookie("access-token", accessToken, {
          httpOnly: true,
          sameSite: "Strict", //"None"?q
          secure: true,
          //path: "/",
          maxAge: 60 * 60 * 5 * 1000, // 5 hours
        });
        return res.json("accessToken sent in cookie");
      }
    });
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
});

usersRoutes.route(api + "login").post(async (req, res, next) => {
  //get user id...
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }, "password");
  if (user) {
    console.log("user:");
    console.log(user);
  } else {
    return res.status(406).send("wrong email or password!");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (valid === false) {
    console.log("wrong pass");
    res.status(406).send("wrong email or password!");
    return;
  }
  const accessToken = jwt.sign(
    {
      userId: user._id,
      email: email,
    },
    process.env.SECRET_KEY_USERS,
    {
      expiresIn: "5h",
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: user._id,
      email: email,
    },
    process.env.REFRESH_TOKEN,
    { expiresIn: "1d" }
  );

  res.cookie("refresh-auth_token", refreshToken, {
    httpOnly: true,
    sameSite: "Strict", //"None"?
    secure: true,
    path: api + "refresh",
    maxAge: 24 * 60 * 60 * 7 * 1000, // 7 days
  });
  res.cookie("access-token", accessToken, {
    httpOnly: true,
    sameSite: "Strict", //"None"?q
    secure: true,
    maxAge: 60 * 60 * 5 * 1000, // 5 hours
  });

  res.status(200).send("ok");
});

//register
usersRoutes.route(api).post(async (req, res, next) => {
  const { firstName, lastName, email, plainPass, phone } = req.body;

  const user = await UnAuthUser.findOne({ email: email });
  if (user) {
    return res.status(409).send("email already exists!");
  }
  let password;
  try {
    const salt = await bcrypt.genSalt(saltRounds);
    password = await bcrypt.hash(plainPass, salt);
  } catch (err) {
    console.log(err);
    throw err;
  }
  const code = Str_Random(6);

  const unAuthUser = new UnAuthUser({
    email,
    firstName,
    lastName,
    password,
    phone,
    code,
    // transaction: new Array(),
    // balance: 0,
  });
  console.log(unAuthUser);

  try {
    await unAuthUser.save();
  } catch (err) {
    console.log(err);
    return next(err);
    return res.status(500).send({ message: "db failed to save data" });
  }
  let registration_token;
  try {
    registration_token = jwt.sign(
      {
        userId: unAuthUser.id,
        email: unAuthUser.email,
      },
      process.env.SECRET_KEY_AUTH,
      { expiresIn: "5h" }
    );
  } catch (err) {
    console.log(err);
    return next(err);
  }

  res.cookie("registration_token", registration_token, {
    httpOnly: true,
    sameSite: "Strict",
    secure: true,
    path: "/api/1/signup/" + "confirmation",
    maxAge: 60 * 30 * 1000, // 30 minutes
  });
  console.log("sending mail...");
  sendEmail("yarintz33@gmail.com", code);

  res.status(201).json({
    success: true,
  });
});

usersRoutes.get(api + "transactions", authFunc, async (req, res) => {
  const user = await User.findById(req.user.userId, "transactions").exec();
  return res.status(200).send({ transactions: user.transactions });
});

usersRoutes.get(api + "balance", authFunc, async (req, res) => {
  const user = await User.findById(req.user.userId, "balance").exec();
  console.log(user.balance);
  return res.status(200).send({ balance: user.balance });
});

usersRoutes.route(api + ":id", async (req, res) => {
  try {
    const userId = req.params.id;
    const fields = req.query.fields;

    if (!fields) {
      return res
        .status(400)
        .json({ error: "Please specify fields to retrieve" });
    }
    const projection = fields.split(",").reduce((acc, field) => {
      acc[field] = 1; // MongoDB uses 1 to include fields in projections
      return acc;
    }, {});

    const user = await User.findById(userId, projection);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Server error", details: error.message });
  }
});

usersRoutes.post(api + "transactions", authFunc, async (req, res) => {
  console.log(req.user.userId);
  console.log(req.user.email);

  const user = await User.findById(
    req.user.userId,
    "email balance transactions"
  ).exec();
  console.log(user.balance);
  const { email, amount } = req.body;
  const otherEmail = email;
  if (user.balance < amount || amount < 0) {
    return res.status(406).send("not enoght money, get a job");
  }
  console.log(user.email);
  console.log(otherEmail);
  const otherUser = await User.findOne(
    { email: otherEmail },
    "balance transactions"
  );
  console.log(otherUser);

  const transaction = {
    from: user.email,
    to: otherEmail,
    amount: amount,
    date: Date.now(),
  };

  // user.transactions.push(transaction);
  // otherUser.transactions.push(transaction);

  const session = await mongoose.startSession(); // Start a session
  session.startTransaction(); // Start a transaction

  try {
    // Update the first user's transactions
    await User.updateOne(
      { _id: user._id },
      { $push: { transactions: transaction } },
      { session }
    );

    // Update the second user's transactions
    await User.updateOne(
      { _id: otherUser._id },
      { $push: { transactions: transaction } },
      { session }
    );

    // Commit the transaction
    await session.commitTransaction();
    console.log("Both updates were successful");
  } catch (error) {
    // Roll back the transaction on error
    await session.abortTransaction();
    console.error("Transaction failed, changes rolled back:", error);
  } finally {
    // End the session
    session.endSession();
  }

  return res.status(200).send({ transaction: user.transactions });
});

function Str_Random(length) {
  let result = "";
  const characters = "0123456789";

  // Loop to generate characters for the specified length
  for (let i = 0; i < length; i++) {
    const randomInd = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomInd);
  }
  return result;
}

usersRoutes.post(api + "signup/confirmation");

export default usersRoutes;
