const express = require("express");
const College = require("../models/college");
const { verifyToken } = require("../middleware/authMiddleware");
const authorize = require("../middleware/role");

const router = express.Router();

// Create college (admin only)
router.post("/", verifyToken, authorize("admin"), async (req, res) => {
  try {
    const college = await College.create(req.body);
    res.status(201).json(college);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

// Get all colleges (public or protected)
router.get("/", async (req, res) => {
  try {
    const colleges = await College.find();
    res.json(colleges);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;