const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const {
  verifyToken,
  isStudent,
} = require("../middleware/authMiddleware");

// ================= ADD TO CART =================
router.post(
  "/add",
  verifyToken,
  isStudent,
  addToCart
);

// ================= GET CART =================
router.get(
  "/",
  verifyToken,
  isStudent,
  getCart
);

// ================= REMOVE ITEM =================
router.delete(
  "/:menuId",
  verifyToken,
  isStudent,
  removeFromCart
);

// ================= CLEAR CART =================
router.delete(
  "/clear",
  verifyToken,
  isStudent,
  clearCart
);

module.exports = router;