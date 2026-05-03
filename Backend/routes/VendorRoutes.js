const express = require("express");
const router = express.Router();

const { verifyToken, isAdmin, isStudent } = require("../middleware/authMiddleware");

const {
  createVendor,
  toggleStatus,
  getVendors
} = require("../controllers/vendorController");

// Create vendor (admin only)
router.post("/create", verifyToken, isAdmin, createVendor);

// Activate/Deactivate vendor (admin only)
router.post("/toggle-status", verifyToken, isAdmin, toggleStatus);

// Get vendors (student only)
router.get("/", verifyToken, isStudent, getVendors);

module.exports = router;