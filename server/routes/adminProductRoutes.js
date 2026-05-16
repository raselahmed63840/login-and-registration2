const express = require("express");
const router = express.Router();

const { uploadProductImages } = require("../middleware/uploadMiddleware");
const adminProductController = require("../controllers/adminProductController");

router.get("/", adminProductController.getProducts);
router.get(
  "/featured-categories",
  adminProductController.getFeaturedCategories,
);
router.get("/:id", adminProductController.getProduct);

router.post("/", uploadProductImages, adminProductController.createProduct);
router.put("/:id", uploadProductImages, adminProductController.updateProduct);

router.delete("/:id", adminProductController.deleteProduct);

module.exports = router;
