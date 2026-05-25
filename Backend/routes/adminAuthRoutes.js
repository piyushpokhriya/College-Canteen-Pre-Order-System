const express = require("express");
const router = express.Router();

const {
  registerCollegeAdmin,
} = require("../controllers/adminAuthController");

// ================= REGISTER COLLEGE ADMIN =================
router.post(
  "/register",
  registerCollegeAdmin
);

module.exports = router;