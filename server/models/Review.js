const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    user: {
      type: String,
      default: "Customer",
    },
    comment: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);