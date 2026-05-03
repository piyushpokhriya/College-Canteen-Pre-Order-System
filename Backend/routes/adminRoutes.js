const express = require("express");
const router = express.Router();

const { applyDiscount } = require("../controllers/adminController");

const { verifyToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/role");

// ================= APPLY DISCOUNT (Admin Only) =================
router.put(
  "/discount/:id",
  verifyToken,
  authorize("admin"),
  applyDiscount
);

module.exports = router;