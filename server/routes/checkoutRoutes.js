const express = require("express");
const router = express.Router();
const {
  placeOrder,
  getOrders,
} = require("../controllers/checkoutController");

router.post("/place-order", placeOrder);
router.get("/orders/:userId", getOrders);

module.exports = router;