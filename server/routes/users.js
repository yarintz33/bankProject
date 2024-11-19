const express = require("express");
const User = require("../mongoConnection");
const usersRoutes = express.Router();
const jwt = require("jsonwebtoken");
//const { getDatabaseConnection } = require("../mongoConnection");
const api = "/api/users/";

// usersRoutes.route(api).post(async (req, res, next) => {
//   try {
//     const newUser = req.body;
//     const { param1, param2 } = req.params;

//     console.log("new user:");
//     console.log(newUser);
//     res.status(200).send("got user registration!");
//     //...
//   } catch (err) {
//     next(err);
//   }
// }); //signup

// const db_connection = getDatabaseConnection();

usersRoutes.route(api).post(async (req, res, next) => {
  const { firstName, lastName, email, password } = req.body;
  console.log(req.body);
  const newUser = new User({
    // new User?
    email,
    firstName,
    lastName,
    password,
    phone: "0556600273",
  });

  try {
    await newUser.save();
  } catch (err) {
    console.log(err);
    return next(err);
  }
  let token;
  try {
    token = jwt.sign(
      {
        userId: newUser.id,
        email: newUser.email,
      },
      "secretkeyappearshere",
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err);
    return next(err);
  }
  res.status(201).json({
    success: true,
    data: {
      userId: newUser.id, // delete later
      email: newUser.email, // delete later
      token: token,
    },
  });
  console.log(newUser.id);
});

// const fetchUserFields = async (userId, fields) => {
//     const queryString = new URLSearchParams({ fields: fields.join(",") }).toString();
//     const response = await fetch(`http://localhost:5000/user/${userId}?${queryString}`);
//     const data = await response.json();
//     console.log(data);
//   };

//   // Fetch `name` and `email` fields for a specific user
//   fetchUserFields("1234567890abcdef", ["name", "email"]);

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

module.exports = usersRoutes;
