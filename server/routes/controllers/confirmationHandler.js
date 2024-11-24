import { User, UnAuthUser } from "../../mongoSchemas.js";
import jwt from "jsonwebtoken";

export default async function confirmation(req, res) {
  console.log("here in confirmation");
  const bodyCode = req.body.code;
  const { email, firstName, lastName, password, code } =
    await UnAuthUser.findById(req.user.userId).exec();
  if (code != bodyCode) {
    return res.status(406).send("incorrect code");
  }

  const newUser = new User({
    email,
    firstName,
    lastName,
    password,
    transaction: new Array(),
    balance: 0,
  });

  await newUser.save();
  await UnAuthUser.deleteOne({ _id: req.user.userId });
  console.log(newUser);
  const accessToken = jwt.sign(
    {
      userId: newUser._id,
      email: email,
    },
    process.env.SECRET_KEY_USERS,
    {
      expiresIn: "5h",
    }
  );
  res.cookie("access-token", accessToken, {
    httpOnly: true,
    sameSite: "Strict", //"None"?q
    secure: true,
    //path: "/",
    maxAge: 60 * 60 * 5 * 1000, // 5 hours
  });
  res.status(200).send("ok body!");
}
