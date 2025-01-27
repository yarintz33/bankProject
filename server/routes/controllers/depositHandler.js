import { User } from "../../models/mongoSchemas.js";

const deposit = async (req, res, next) => {
  const user = await User.findById(req.user.userId, "balance").exec();
  const { amount } = req.body;
  const newBalance = user.balance + amount;

  await User.updateOne({ _id: user._id }, { $set: { balance: newBalance } });

  return res.status(200).send({ message: "deposit succeed!" });
};

export default deposit;
