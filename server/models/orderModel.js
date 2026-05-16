const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: String,
      default: "",
    },

    title: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      default: 0,
    },

    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
  },
  { _id: false },
);

const addressSchema = new mongoose.Schema(
  {
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
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderId: {
      type: String,
      unique: true,
      required: true,
    },

    userId: {
      type: String,
      default: "guestUser",
    },

    customerName: {
      type: String,
      required: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    district: {
      type: String,
      default: "",
    },

    area: {
      type: String,
      default: "",
    },

    address: {
      type: String,
      required: true,
      trim: true,
    },

    shippingAddress: {
      type: addressSchema,
      default: {},
    },

    billingSameAsShipping: {
      type: Boolean,
      default: true,
    },

    billingAddress: {
      type: addressSchema,
      default: {},
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

    items: {
      type: [orderItemSchema],
      default: [],
    },

    subtotal: {
      type: Number,
      default: 0,
    },

    subTotal: {
      type: Number,
      default: 0,
    },

    deliveryCost: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },

    total: {
      type: Number,
      required: true,
      default: 0,
    },

    totalAmount: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Shipped", "Delivered", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Unpaid", "Paid"],
      default: "Unpaid",
    },
  },
  { timestamps: true },
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
