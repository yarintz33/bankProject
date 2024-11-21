import dotenv from "dotenv";
dotenv.config({ path: "./config.env" });

import mongoose from "mongoose";

const Db = process.env.ATLAS_URI;

const TransactionSchema = new mongoose.Schema({
  from: { type: String, required: true },
  to: { type: String, required: true },
  amount: { type: Number, required: true },
  date: { type: Date },
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  transactions: { type: [TransactionSchema], required: false },
  balance: { type: Number, required: false },
});

const unAuthUserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
  code: { type: String, required: true },
});

const UnAuthUser = mongoose.model("unAuthUsers", unAuthUserSchema);
const User = mongoose.model("users", userSchema);

async function connectToDatabase() {
  try {
    await mongoose.connect(Db);
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    throw err;
  }
}

connectToDatabase();

export { User, UnAuthUser };