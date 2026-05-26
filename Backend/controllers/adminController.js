const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

// ================= APPROVE VENDOR =================
exports.approveVendor = async (req, res) => {
  try {
    const { vendorId } = req.params;

    const vendor = await Vendor.findOne({
      _id: vendorId,
      collegeId: req.user.collegeId,
    });

    if (!vendor) {
      return res.status(404).json({ msg: "Vendor not found" });
    }

    vendor.isApproved = true;
    vendor.status = "approved";

    await vendor.save();

    res.json({
      msg: "Vendor approved successfully",
      vendor,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= GET USERS =================
exports.getAllUsersAdmin = async (req, res) => {
  try {
    const users = await User.find({
      collegeId: req.user.collegeId,
      role: { $ne: "admin" },
    }).select("-password");

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load users" });
  }
};

// ================= UPDATE USER =================
exports.updateUserAdmin = async (req, res) => {
  try {
    const { name, email, role, password } = req.body;

    const user = await User.findOne({
      _id: req.params.id,
      collegeId: req.user.collegeId,
      role: { $ne: "admin" },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.role = role || user.role;

    if (password && password.trim() !== "") {
      user.password = await bcrypt.hash(password, 10);
    }

    await user.save();

    res.json({
      msg: "User updated successfully",
      user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to update user" });
  }
};

// ================= DELETE USER =================
exports.deleteUserAdmin = async (req, res) => {
  try {
    const user = await User.findOneAndDelete({
      _id: req.params.id,
      collegeId: req.user.collegeId,
      role: { $ne: "admin" },
    });

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    await Vendor.deleteMany({ owner: user._id });

    res.json({ msg: "User deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete user" });
  }
};

// ================= GET VENDORS =================
exports.getAllVendorsAdmin = async (req, res) => {
  try {
    const vendors = await Vendor.find({
      collegeId: req.user.collegeId,
    }).populate("owner", "name email");

    res.json(vendors);
  } catch (err) {
    res.status(500).json({ msg: "Failed to load vendors" });
  }
};

// ================= UPDATE VENDOR =================
exports.updateVendorAdmin = async (req, res) => {
  try {
    const { shopName, status, isActive } = req.body;

    const vendor = await Vendor.findOne({
      _id: req.params.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor) {
      return res.status(404).json({ msg: "Vendor not found" });
    }

    vendor.shopName = shopName || vendor.shopName;

    if (status) {
      vendor.status = status;
      vendor.isApproved = status === "approved";
    }

    if (typeof isActive === "boolean") {
      vendor.isActive = isActive;
      vendor.isOpen = isActive;
    }

    await vendor.save();

    res.json({ msg: "Vendor updated", vendor });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update vendor" });
  }
};

// ================= DELETE VENDOR =================
exports.deleteVendorAdmin = async (req, res) => {
  try {
    const vendor = await Vendor.findOneAndDelete({
      _id: req.params.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor) {
      return res.status(404).json({ msg: "Vendor not found" });
    }

    res.json({ msg: "Vendor deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete vendor" });
  }
};