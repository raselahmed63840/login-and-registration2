const express = require("express");
const router = express.Router();

const {
  getProductReviews,
  canReviewProduct,
  createReview,
} = require("../controllers/reviewController");

const { protect } = require("../middleware/authMiddleware");

router.get("/:productId", getProductReviews);

router.get("/:productId/can-review", protect, canReviewProduct);

router.post("/", protect, createReview);

module.exports = router;