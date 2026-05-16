const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  status: { type: String, enum: ["cart", "pending", "shipped", "delivered"], default: "cart" },
  customer: {
    name: String,
    address: String,
    phone: String,
  }
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
