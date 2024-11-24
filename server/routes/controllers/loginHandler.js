import { User } from "../../mongoSchemas.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const login = async (req, res, next) => {
  //get user id...
  console.log("here in login handler");
  const { email, password } = req.body;
  const user = await User.findOne({ email: email }, "password");
  console.log("user trying to log in:");
  console.log(user);
  if (!user) {
    return res.status(406).send("wrong email or password!");
  }

  const valid = await bcrypt.compare(password, user.password);
  if (valid === false) {
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
    path: "/api/1/" + "refresh",
    maxAge: 24 * 60 * 60 * 1 * 1000, // 1 day
  });
  res.cookie("access-token", accessToken, {
    httpOnly: true,
    sameSite: "Lax", //"None"?q
    secure: false, //change to true in production
    maxAge: 60 * 60 * 1 * 1000, // 1 hour
  });

  res.status(200).send({ message: "login successfully!" });
};

export default login;
