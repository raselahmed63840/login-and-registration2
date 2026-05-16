const Order = require("../models/orderModel");

const generateOrderId = () => {
  const date = new Date();

  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const random = Math.floor(100000 + Math.random() * 900000);

  return `SE-${y}${m}${d}-${random}`;
};

exports.createOrder = async (req, res) => {
  try {
    const {
      customerName,
      name,
      phone,
      district,
      area,
      address,
      paymentMethod,
      items,
      subtotal,
      subTotal,
      deliveryCost,
      discount,
      total,
      totalAmount,
      shippingAddress,
      billingAddress,
      billingSameAsShipping,
      coupon,
      specialNotes,
      userId,
    } = req.body;

    const finalCustomerName =
      customerName || name || shippingAddress?.fullName || "Guest Customer";

    const finalPhone = phone || shippingAddress?.phone || "";

    const finalDistrict = district || shippingAddress?.district || "";

    const finalArea = area || shippingAddress?.thana || "";

    const finalAddress = address || shippingAddress?.addressLine || "";

    if (!finalCustomerName || !finalPhone || !finalAddress) {
      return res.status(400).json({
        success: false,
        message: "Customer name, phone and address are required.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Order items are required.",
      });
    }

    const cleanItems = items.map((item, index) => ({
      productId: String(item.productId || item._id || item.id || index),
      title: item.title || item.name || "Product",
      image: item.image || "",
      price: Number(item.price || 0),
      quantity: Number(item.quantity || item.qty || 1),
    }));

    const calculatedSubtotal = cleanItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const finalSubtotal = Number(subtotal ?? subTotal ?? calculatedSubtotal);
    const finalDeliveryCost = Number(deliveryCost || 0);
    const finalDiscount = Number(discount || 0);

    const finalTotal =
      Number(total ?? totalAmount) ||
      finalSubtotal + finalDeliveryCost - finalDiscount;

    const order = await Order.create({
      orderId: generateOrderId(),
      userId: userId || "guestUser",

      customerName: finalCustomerName,
      phone: finalPhone,
      district: finalDistrict,
      area: finalArea,
      address: finalAddress,

      shippingAddress: shippingAddress || {
        fullName: finalCustomerName,
        phone: finalPhone,
        district: finalDistrict,
        thana: finalArea,
        addressLine: finalAddress,
      },

      billingSameAsShipping:
        billingSameAsShipping === undefined ? true : billingSameAsShipping,

      billingAddress: billingAddress || shippingAddress || {},

      paymentMethod: paymentMethod || "Cash On Delivery",

      coupon: coupon || "",
      specialNotes: specialNotes || "",

      items: cleanItems,

      subtotal: finalSubtotal,
      subTotal: finalSubtotal,
      deliveryCost: finalDeliveryCost,
      discount: finalDiscount,
      total: finalTotal,
      totalAmount: finalTotal,

      status: "Pending",
      paymentStatus: "Unpaid",
    });

    res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order,
    });
  } catch (error) {
    console.error("Create order error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      orders,
      totalOrders: orders.length,
    });
  } catch (error) {
    console.error("Get orders error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({
      $or: [{ _id: req.params.id }, { orderId: req.params.id }],
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Get order error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    if (status) order.status = status;
    if (paymentStatus) order.paymentStatus = paymentStatus;

    const updatedOrder = await order.save();

    res.json({
      success: true,
      message: "Order updated successfully.",
      order: updatedOrder,
    });
  } catch (error) {
    console.error("Update order error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found.",
      });
    }

    res.json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("Delete order error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
