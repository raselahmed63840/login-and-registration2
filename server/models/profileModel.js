const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      default: "",
      trim: true,
    },
    profileImage: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
      trim: true,
    },
    username: {
      type: String,
      default: "",
      trim: true,
    },
    shippingAddress: {
      type: String,
      default: "",
    },
    billingAddress: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Profile", profileSchema);