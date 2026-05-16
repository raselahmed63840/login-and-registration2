const Checkout = require("../models/checkoutModel");

const onlyDigits = (value = "") => {
  return String(value).replace(/\D/g, "");
};

const normalizeBDPhone = (value = "") => {
  let phone = onlyDigits(value);

  if (!phone) return "";

  // +8801712345678 / 8801712345678 -> 01712345678
  if (phone.startsWith("880") && phone.length >= 13) {
    phone = "0" + phone.slice(3);
  }

  // 1712345678 -> 01712345678
  if (phone.length === 10 && phone.startsWith("1")) {
    phone = "0" + phone;
  }

  // keep last 11 digits as final BD mobile format
  if (phone.length > 11) {
    phone = phone.slice(-11);
  }

  return phone;
};

const phoneMatches = (savedPhone = "", inputPhone = "") => {
  const saved = normalizeBDPhone(savedPhone);
  const input = normalizeBDPhone(inputPhone);

  if (!saved || !input) return false;

  return saved === input;
};

const idMatches = (order, inputOrderId = "") => {
  const cleanInput = String(inputOrderId).trim();

  if (!cleanInput) return false;

  const mongoId = String(order._id || "");
  const customOrderId = String(order.orderId || "");

  return (
    mongoId === cleanInput ||
    mongoId.endsWith(cleanInput) ||
    customOrderId === cleanInput ||
    customOrderId.endsWith(cleanInput)
  );
};

const getSavedPhones = (order) => {
  return [
    order.shippingAddress?.phone,
    order.billingAddress?.phone,
    order.phone,
    order.customerPhone,
  ].filter(Boolean);
};

exports.trackOrder = async (req, res) => {
  try {
    const orderId = String(
      req.params.orderId || req.query.orderId || req.body?.orderId || "",
    ).trim();

    const phone = String(req.query.phone || req.body?.phone || "").trim();

    if (!orderId && !phone) {
      return res.status(400).json({
        success: false,
        message: "Please enter Order ID or Phone Number",
      });
    }

    const allOrders = await Checkout.find({}).sort({ createdAt: -1 });

    const matchedOrders = allOrders.filter((order) => {
      const matchByOrderId = orderId ? idMatches(order, orderId) : false;

      const matchByPhone = phone
        ? getSavedPhones(order).some((savedPhone) =>
            phoneMatches(savedPhone, phone),
          )
        : false;

      return matchByOrderId || matchByPhone;
    });

    if (matchedOrders.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.json({
      success: true,
      message: "Order found",
      count: matchedOrders.length,
      order: matchedOrders[0],
      orders: matchedOrders,
    });
  } catch (error) {
    console.error("Track order error:", error);

    return res.status(500).json({
      success: false,
      message: "Order tracking failed",
    });
  }
};
