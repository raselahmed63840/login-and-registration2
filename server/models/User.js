const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      default: "",
    },

    fullName: {
      type: String,
      trim: true,
      default: "",
    },

    username: {
      type: String,
      trim: true,
      default: "",
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
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
      trim: true,
      index: true,
      default: "",
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

    address: {
      fullName: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      district: {
        type: String,
        default: "",
      },
      thana: {
        type: String,
        default: "",
      },
      addressLine: {
        type: String,
        default: "",
      },
    },

    wishlist: [
      {
        productId: {
          type: String,
          default: "",
        },
        title: {
          type: String,
          default: "",
        },
        price: {
          type: Number,
          default: 0,
        },
        image: {
          type: String,
          default: "",
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", userSchema);
