const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");

const {
  createMenu,
  getAllMenu,
  getVendorMenu,
  updateMenu,
  deleteMenu,
  getTopItems,
  toggleAvailability,
  applyDiscount,
} = require("../controllers/menuController");

const { verifyToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/role");

// ================= ADD MENU ITEM =================
router.post(
  "/",
  verifyToken,
  authorize("vendor"),
  upload.single("image"),
  createMenu
);

// ================= GET ALL MENU =================
router.get("/", verifyToken, getAllMenu);

// ================= TOP ITEMS =================
router.get("/top", verifyToken, getTopItems);

// ================= VENDOR MENU =================
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

// ================= TOGGLE AVAILABILITY =================
router.put(
  "/toggle/:id",
  verifyToken,
  authorize("vendor"),
  toggleAvailability
);

// ================= APPLY DISCOUNT =================
router.put(
  "/discount/:id",
  verifyToken,
  authorize("vendor"),
  applyDiscount
);

// ================= DELETE MENU =================
router.delete(
  "/:id",
  verifyToken,
  authorize("vendor"),
  deleteMenu
);

module.exports = router;