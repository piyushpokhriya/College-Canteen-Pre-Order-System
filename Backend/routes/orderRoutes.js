const express = require("express");
const router = express.Router();

const { verifyToken, isStudent } = require("../middleware/authMiddleware");
const { placeOrder } = require("../controllers/orderController");

// Place order (student only)
router.post("/place", verifyToken, isStudent, placeOrder);

module.exports = router;