const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    brand: { type: String },
    description: { type: String },
    price: { type: Number, required: true },
    category: { type: String },
    stock: { type: Number, default: 0 },
    image: { type: String },
    image2: { type: String },
    image3: { type: String },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Product || mongoose.model("Product", productSchema);