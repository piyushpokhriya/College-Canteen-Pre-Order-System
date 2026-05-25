const User = require("../models/User");
const College = require("../models/college");
const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= SIGNUP =================
const signup = async (req, res) => {
  try {
    const { name, email, password, collegeName, role, shopName } = req.body;

    if (!name || !email || !password || !collegeName || !role) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedCollege = collegeName.toLowerCase().trim();

    const college = await College.findOneAndUpdate(
      { name: normalizedCollege },
      { name: normalizedCollege },
      { upsert: true, new: true }
    );

    const existingUser = await User.findOne({
      email: normalizedEmail,
      collegeId: college._id,
    });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      password: await bcrypt.hash(password, 10),
      role,
      collegeId: college._id,
    });

    if (role === "vendor") {
      await Vendor.create({
        shopName,
        owner: user._id,
        collegeId: college._id,
        status: "pending",
        isApproved: false,
      });

      return res.json({
        msg: "Vendor request sent. Waiting for admin approval",
      });
    }

    const token = jwt.sign(
      { id: user._id, role, collegeId: college._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user });

  } catch (err) {
    console.log("SIGNUP ERROR:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};

// ================= LOGIN =================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);

    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    if (user.role === "vendor") {
      const vendor = await Vendor.findOne({ owner: user._id });

      if (!vendor || vendor.status !== "approved") {
        return res.status(403).json({
          msg: "Waiting for admin approval",
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
        collegeId: user.collegeId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token, user });

  } catch (err) {
    return res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { signup, login };