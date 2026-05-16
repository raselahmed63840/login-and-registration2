const Cart = require("../models/cartModel");

// Add to Cart
exports.addToCart = async (req, res) => {
  try {
    let { productId, quantity } = req.body;
    const userId = "demoUser";

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "productId is required",
      });
    }

    productId = String(productId);
    quantity = Number(quantity) || 1;

    const existing = await Cart.findOne({ userId, productId });

    if (existing) {
      existing.quantity += quantity;
      await existing.save();
    } else {
      await Cart.create({ userId, productId, quantity });
    }

    res.json({ success: true, message: "Added to cart" });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};

// Remove from Cart
exports.removeFromCart = async (req, res) => {
  try {
    let { productId } = req.body;
    const userId = "demoUser";

    if (!productId) {
      return res.status(400).json({
        success: false,
        error: "productId is required",
      });
    }

    productId = String(productId);

    await Cart.deleteOne({ userId, productId });

    res.json({ success: true, message: "Removed from cart" });
  } catch (err) {
    console.error("Remove from cart error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
};