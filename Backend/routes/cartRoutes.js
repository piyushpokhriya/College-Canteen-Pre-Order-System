const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  updateCartQuantity,
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

// ================= UPDATE QUANTITY =================
router.put(
  "/update/:menuId",
  verifyToken,
  isStudent,
  updateCartQuantity
);

// ================= CLEAR CART =================
// IMPORTANT: keep this before "/:menuId"
router.delete(
  "/clear",
  verifyToken,
  isStudent,
  clearCart
);

// ================= REMOVE ITEM =================
router.delete(
  "/:menuId",
  verifyToken,
  isStudent,
  removeFromCart
);

module.exports = router;