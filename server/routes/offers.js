const express = require("express");
const router = express.Router();
const {
  getOffers,
  addOffer,
  updateOffer,
  deleteOffer
} = require("../controllers/offerController");

router.get("/", getOffers);
router.post("/", addOffer);
router.put("/:id", updateOffer);
router.delete("/:id", deleteOffer);

module.exports = router;
