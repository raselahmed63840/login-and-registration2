const express = require("express");
const router = express.Router();
const {
  verifyPayment,
  refundPayment,
  getTransactions
} = require("../controllers/paymentController");

router.put("/:id/verify", verifyPayment);
router.put("/:id/refund", refundPayment);
router.get("/transactions", getTransactions);

module.exports = router;
