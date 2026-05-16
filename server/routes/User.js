const express = require("express");
const router = express.Router();
const {
  getUsers,
  blockUser,
  unblockUser,
  setRole
} = require("../controllers/userController");

router.get("/", getUsers);
router.put("/:id/block", blockUser);
router.put("/:id/unblock", unblockUser);
router.put("/:id/role", setRole);

module.exports = router;
