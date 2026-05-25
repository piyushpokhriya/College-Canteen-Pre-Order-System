const express = require("express");
const router = express.Router();

const {
  getAdminStats,
} = require("../controllers/adminStatsController");

const { verifyToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/role");

router.get(
  "/stats",
  verifyToken,
  authorize("admin"),
  getAdminStats
);

module.exports = router;