//const { MongoClient } = require("mongodb");
//console.log(process.env.ATLAS_URI);
require("dotenv").config({ path: "./config.env" });

const mongoose = require("mongoose");

const Db = process.env.ATLAS_URI;
//const Db =
//  "mongodb+srv://yarintz33:Yoyotz7788@cluster0.h8nii.mongodb.net/Bank?retryWrites=true&w=majority&appName=Cluster0";
//const client = new MongoClient(Db);
//mongoose.connect(Db);

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  phone: { type: String, required: true },
});

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
// let User;
// let userSchema;
// connect()
//   .then(() => {
//     userSchema = new mongoose.Schema({
//       name: { type: String, required: true },
//       email: { type: String, required: true, unique: true },
//       password: { type: String, required: true },
//       phone: { type: String, required: true },
//     });
//   })
//   .then(() => {
//     User = mongoose.model("User", userSchema);
//   });

module.exports = User;

// Export the connection function
