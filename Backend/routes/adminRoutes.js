const express = require("express");
const router = express.Router();

const {
  approveVendor,
  getAllUsersAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  getAllVendorsAdmin,
  updateVendorAdmin,
  deleteVendorAdmin,
} = require("../controllers/adminController");

const {
  getPendingVendors,
} = require("../controllers/adminNotificationController");

const {
  getAdminStats,
} = require("../controllers/adminStatsController");

const { verifyToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/role");

router.get("/stats", verifyToken, authorize("admin"), getAdminStats);

router.get(
  "/vendors/pending",
  verifyToken,
  authorize("admin"),
  getPendingVendors
);

router.put(
  "/vendors/approve/:vendorId",
  verifyToken,
  authorize("admin"),
  approveVendor
);

// users
router.get("/users", verifyToken, authorize("admin"), getAllUsersAdmin);
router.put("/users/:id", verifyToken, authorize("admin"), updateUserAdmin);
router.delete("/users/:id", verifyToken, authorize("admin"), deleteUserAdmin);

// vendors
router.get("/vendors", verifyToken, authorize("admin"), getAllVendorsAdmin);
router.put("/vendors/:id", verifyToken, authorize("admin"), updateVendorAdmin);
router.delete("/vendors/:id", verifyToken, authorize("admin"), deleteVendorAdmin);

module.exports = router;