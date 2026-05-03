const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createMenu,
  getAllMenu,
  getVendorMenu,
  updateMenu,
  deleteMenu,
  getTopItems 
} = require("../controllers/menuController");

const { verifyToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/role");

// ================= ADD ITEM (Vendor Only) =================
router.post(
  "/",
  verifyToken,
  authorize("vendor"),
  upload.single("image"),
  createMenu
);

// ================= GET ALL MENU =================
router.get(
  "/",
  verifyToken,
  getAllMenu
);

// ================= TOP ITEMS (NEW) =================
router.get(
  "/top",
  verifyToken,
  getTopItems
);

// ================= GET VENDOR MENU =================
router.get(
  "/vendor",
  verifyToken,
  authorize("vendor"),
  getVendorMenu
);

// ================= UPDATE MENU =================
router.put(
  "/:id",
  verifyToken,
  authorize("vendor"),
  updateMenu
);

// ================= DELETE MENU =================
router.delete(
  "/:id",
  verifyToken,
  authorize("vendor"),
  deleteMenu
);

module.exports = router;