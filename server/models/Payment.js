const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  method: { type: String, enum: ["bkash", "sslcommerz", "stripe", "cash"], required: true },
  status: { type: String, enum: ["pending", "verified", "failed", "refunded"], default: "pending" },
  transactionId: String,
  amount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);
