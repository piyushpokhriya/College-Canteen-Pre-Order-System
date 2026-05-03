const Vendor = require("../models/Vendor");

// CREATE VENDOR (Admin)
exports.createVendor = async (req, res) => {
  try {
    const { shopName } = req.body;

    if (!shopName) {
      return res.status(400).json({ msg: "Shop name is required" });
    }

    const vendor = await Vendor.create({
      shopName,
      owner: req.user.id,
      collegeId: req.user.collegeId
    });

    res.status(201).json({ msg: "Vendor created", vendor });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// TOGGLE OPEN/CLOSE (Admin controls vendor)
exports.toggleStatus = async (req, res) => {
  try {
    const { vendorId } = req.body;

    const vendor = await Vendor.findById(vendorId);

    if (!vendor) {
      return res.status(404).json({ msg: "Vendor not found" });
    }

    vendor.isOpen = !vendor.isOpen;
    await vendor.save();

    res.json({ msg: "Status updated", vendor });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// GET VENDORS (Student)
exports.getVendors = async (req, res) => {
  try {
    console.log("USER:", req.user); // DEBUG

    const vendors = await Vendor.find({
      collegeId: req.user.collegeId
    });

    console.log("FOUND VENDORS:", vendors); // DEBUG

    res.json(vendors);

  } catch (error) {
    console.error("Get Vendors Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};