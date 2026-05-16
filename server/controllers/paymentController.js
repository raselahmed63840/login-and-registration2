const Payment = require("../models/Payment");

exports.verifyPayment = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, { status: "verified" }, { new: true });
  res.json(payment);
};

exports.refundPayment = async (req, res) => {
  const payment = await Payment.findByIdAndUpdate(req.params.id, { status: "refunded" }, { new: true });
  res.json(payment);
};

exports.getTransactions = async (req, res) => {
  const transactions = await Payment.find().populate("order");
  res.json(transactions);
};
