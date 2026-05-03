const User = require("../models/User");
const College = require("../models/college");
const Vendor = require("../models/Vendor"); 
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= SIGNUP =================
exports.signup = async (req, res) => {
  try {
    const { name, email, password, collegeName, role } = req.body;

    // ===== VALIDATION =====
    if (!name || !email || !password || !collegeName || !role) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ===== NORMALIZE COLLEGE =====
    const normalizedName = collegeName.toLowerCase().trim();

    // ===== FIND OR CREATE COLLEGE =====
    let college = await College.findOne({ name: normalizedName });

    if (!college) {
      college = await College.create({ name: normalizedName });
    }

    if (!college || !college._id) {
      return res.status(500).json({ msg: "College creation failed" });
    }

    // ===== CHECK EXISTING USER =====
    const existingUser = await User.findOne({
      email,
      collegeId: college._id,
    });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // ===== HASH PASSWORD =====
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===== CREATE USER =====
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      collegeId: college._id,
      role,
    });

    // ===== AUTO CREATE VENDOR (IMPORTANT FIX) =====
    if (role === "vendor") {
      await Vendor.create({
        shopName: name + " Shop", // basic default name
        owner: user._id,
        collegeId: user.collegeId,
        isOpen: true,
      });
    }

    // ===== CREATE TOKEN =====
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        collegeId: user.collegeId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ===== RESPONSE =====
    res.status(201).json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Signup Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// ================= LOGIN =================
exports.login = async (req, res) => {
  try {
    const { email, password, collegeName } = req.body;

    // ===== VALIDATION =====
    if (!email || !password || !collegeName) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // ===== NORMALIZE COLLEGE =====
    const normalizedName = collegeName.toLowerCase().trim();

    const college = await College.findOne({ name: normalizedName });

    if (!college) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ===== FIND USER =====
    const user = await User.findOne({
      email,
      collegeId: college._id,
    });

    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ===== PASSWORD CHECK =====
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    // ===== CREATE TOKEN =====
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        collegeId: user.collegeId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ===== RESPONSE =====
    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
      },
    });

  } catch (err) {
    console.error("Login Error:", err.message);
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};