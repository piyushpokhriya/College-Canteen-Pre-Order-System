const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getUserOrders,
  getAllOrdersAdmin,
  updateOrderStatus,
  paymentSuccess,
  getVendorOrders,
  markOrderCompletedByVendor,
} = require("../controllers/orderController");

const {
  verifyToken,
  isAdmin,
  isStudent,
  isVendor,
} = require("../middleware/authMiddleware");

// ================= USER =================
router.post("/place", verifyToken, isStudent, placeOrder);

router.get("/user", verifyToken, isStudent, getUserOrders);

// ================= ADMIN =================
router.get("/admin", verifyToken, isAdmin, getAllOrdersAdmin);

router.put("/status/:id", verifyToken, isAdmin, updateOrderStatus);

// ================= PAYMENT =================
router.post(
  "/payment-success",
  verifyToken,
  isStudent,
  paymentSuccess
);

// ================= VENDOR =================
router.get(
  "/vendor",
  verifyToken,
  isVendor,
  getVendorOrders
);

router.put(
  "/vendor/complete/:id",
  verifyToken,
  isVendor,
  markOrderCompletedByVendor
);

module.exports = router;