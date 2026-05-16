const Checkout = require("../models/checkoutModel");

exports.placeOrder = async (req, res) => {
  try {
    const {
      userId,
      items,
      shippingAddress,
      billingSameAsShipping,
      billingAddress,
      paymentMethod,
      coupon,
      specialNotes,
      subTotal,
      deliveryCost,
      total,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items found for checkout",
      });
    }

    if (!shippingAddress?.fullName || !shippingAddress?.phone || !shippingAddress?.district || !shippingAddress?.addressLine) {
      return res.status(400).json({
        success: false,
        message: "Shipping address is required",
      });
    }

    const order = await Checkout.create({
      userId: userId || "demoUser",
      items,
      shippingAddress,
      billingSameAsShipping,
      billingAddress: billingSameAsShipping ? shippingAddress : billingAddress,
      paymentMethod,
      coupon,
      specialNotes,
      subTotal,
      deliveryCost,
      total,
      status: "Pending",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const userId = req.params.userId || "demoUser";
    const orders = await Checkout.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};