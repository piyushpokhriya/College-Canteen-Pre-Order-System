const express = require("express");
const router = express.Router();

const {
  getVendorStats,
  applyDiscount,
  toggleVendorCard,
  getVendors,
} = require("../controllers/vendorController");

const {
  verifyToken,
  isVendor,
} = require("../middleware/authMiddleware");

// ================= USER SIDE =================
router.get("/", verifyToken, getVendors);

// ================= STATS =================
router.get(
  "/stats",
  verifyToken,
  isVendor,
  getVendorStats
);

// ================= DISCOUNT =================
router.put(
  "/menu/discount/:id",
  verifyToken,
  isVendor,
  applyDiscount
);

// ================= TOGGLE SHOP =================
router.put(
  "/toggle-card",
  verifyToken,
  isVendor,
  toggleVendorCard
);

module.exports = router;