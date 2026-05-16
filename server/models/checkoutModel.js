const mongoose = require("mongoose");

const checkoutItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      required: true,
    },
    title: String,
    image: String,
    price: Number,
    quantity: {
      type: Number,
      default: 1,
    },
  },
  { _id: false }
);

const checkoutSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      default: "demoUser",
    },

    items: [checkoutItemSchema],

    shippingAddress: {
      fullName: String,
      phone: String,
      district: String,
      thana: String,
      addressLine: String,
    },

    billingSameAsShipping: {
      type: Boolean,
      default: true,
    },

    billingAddress: {
      fullName: String,
      phone: String,
      district: String,
      thana: String,
      addressLine: String,
    },

    paymentMethod: {
      type: String,
      default: "Cash On Delivery",
    },

    coupon: {
      type: String,
      default: "",
    },

    specialNotes: {
      type: String,
      default: "",
    },

    subTotal: {
      type: Number,
      default: 0,
    },

    deliveryCost: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Checkout", checkoutSchema);