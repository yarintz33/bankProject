import { Transaction, User } from "../../mongoSchemas.js";

const getTransactions = async (req, res) => {
  const user = await User.findById(req.user.userId, "transactions").exec();
  const transactions = await Transaction.find({
    _id: { $in: user.transactions },
  });
  return res.status(200).send({ transactions: transactions });
};

export default getTransactions;
