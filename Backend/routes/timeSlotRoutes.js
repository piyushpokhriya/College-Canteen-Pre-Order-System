const express = require("express");
const router = express.Router();

const {
  addTimeSlot,
  getSlots,
  deleteSlot,
} = require("../controllers/timeSlotController");

const {
  verifyToken,
  isAdmin,
} = require("../middleware/authMiddleware");

// ADMIN ONLY
router.post("/", verifyToken, isAdmin, addTimeSlot);
router.get("/", verifyToken, isAdmin, getSlots);
router.delete("/:id", verifyToken, isAdmin, deleteSlot);

module.exports = router;