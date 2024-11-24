import express from "express";
//import cookieparser from 'cookie-parser';
import postTransactions from "./controllers/postTransactionsHandler.js";
import getTransactions from "./controllers/getTransactionsHandler.js";
import { User } from "../mongoSchemas.js";
import { authFunc } from "../authenticationHandler.js";
import register from "./controllers/registerHadler.js";

const usersRoutes = express.Router();

const saltRounds = 10;

const api = "/api/1/users/";

//register
usersRoutes.post(api, register);

usersRoutes.get(api + "balance", authFunc, async (req, res) => {
  const user = await User.findById(req.user.userId, "balance").exec();
  return res.status(200).send({ balance: user.balance });
});

// usersRoutes.post(api + "transactions", authFunc, async (req, res) => {
//   const user = await User.findById(
//     req.user.userId,
//     "email balance transactions"
//   ).exec();
//   const { email, amount } = req.body;
//   const otherEmail = email;
//   if (user.balance < amount || amount < 0) {
//     return res.status(406).send("not enoght money, get a job");
//   }

//   const otherUser = await User.findOne(
//     { email: otherEmail },
//     "balance transactions"
//   );

//   const transaction = {
//     from: user.email,
//     to: otherEmail,
//     amount: amount,
//     date: Date.now(),
//   };

//   const session = await mongoose.startSession(); // Start a session
//   session.startTransaction(); // Start a transaction

//   try {
//     // Update the first user's transactions
//     await User.updateOne(
//       { _id: user._id },
//       { $push: { transactions: transaction } },
//       { session }
//     );

//     // Update the second user's transactions
//     await User.updateOne(
//       { _id: otherUser._id },
//       { $push: { transactions: transaction } },
//       { session }
//     );

//     // Commit the transaction
//     await session.commitTransaction();
//     console.log("Both updates were successful");
//   } catch (error) {
//     // Roll back the transaction on error
//     await session.abortTransaction();
//     console.error("Transaction failed, changes rolled back:", error);
//   } finally {
//     // End the session
//     session.endSession();
//   }

//   return res.status(200).send({ transaction: user.transactions });
// });

usersRoutes.post(api + "transactions", authFunc, postTransactions);

usersRoutes.get(api + "transactions", authFunc, getTransactions);

export default usersRoutes;
