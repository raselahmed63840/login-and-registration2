const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AdminProduct",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    userName: {
      type: String,
      default: "Customer",
      trim: true,
    },

    userEmail: {
      type: String,
      default: "",
      trim: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },

    comment: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

reviewSchema.index({ productId: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ createdAt: -1 });

module.exports =
  mongoose.models.Review || mongoose.model("Review", reviewSchema);
