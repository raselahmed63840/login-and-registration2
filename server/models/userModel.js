const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    username: {
      type: String,
      default: "",
      trim: true,
    },

    email: {
      type: String,
      default: "",
      trim: true,
      unique: true,
      sparse: true,
      lowercase: true,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
      default: "",
    },

    firebaseUid: {
      type: String,
      default: "",
      index: true,
    },

    authProvider: {
      type: String,
      enum: ["local", "google", "facebook", "firebase"],
      default: "local",
    },

    photoURL: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["customer", "vendor", "admin"],
      default: "customer",
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    wishlist: [
      {
        productId: String,
        title: String,
        price: Number,
        image: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);