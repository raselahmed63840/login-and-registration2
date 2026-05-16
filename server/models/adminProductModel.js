const mongoose = require("mongoose");

const adminProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    oldPrice: {
      type: Number,
      default: 0,
    },

    stock: {
      type: Number,
      default: 0,
    },

    category: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    brand: {
      type: String,
      default: "",
      trim: true,
    },

    image: {
      type: String,
      default: "",
    },

    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["Visible", "Hidden"],
      default: "Visible",
    },

    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

module.exports =
  mongoose.models.AdminProduct ||
  mongoose.model("AdminProduct", adminProductSchema);
