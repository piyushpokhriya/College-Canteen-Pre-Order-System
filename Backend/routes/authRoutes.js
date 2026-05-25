const express = require("express");
const router = express.Router();

const {
  signup,
  login,
} = require("../controllers/authController");

// ================= SIGNUP =================
router.post("/signup", signup);

// ================= LOGIN =================
router.post("/login", login);

module.exports = router;