import { UnAuthUser } from "../../mongoSchemas.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendEmail from "../../nodeMailer.js";

const saltRounds = 10;

const register = async (req, res, next) => {
  const { firstName, lastName, email, plainPass } = req.body;

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
    code,
    // transaction: new Array(),
    // balance: 0,
  });

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
    path: "/api/1/" + "confirmation",
    maxAge: 60 * 30 * 1000, // 30 minutes
  });
  console.log("sending mail...");
  sendEmail("yarintz33@gmail.com", code);

  res.status(201).json({
    success: true,
  });
};

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

export default register;
