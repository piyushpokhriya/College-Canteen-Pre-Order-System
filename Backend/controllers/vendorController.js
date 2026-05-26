const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Vendor = require("../models/Vendor");

// ================= APPLY DISCOUNT =================
exports.applyDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount } = req.body;

    const vendor = await Vendor.findOne({
      owner: req.user.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor) {
      return res.status(404).json({ msg: "Vendor profile not found" });
    }

    const menu = await Menu.findOne({
      _id: id,
      vendorId: vendor._id,
    });

    if (!menu) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    menu.discount = discount;
    await menu.save();

    res.json({
      msg: "Discount updated successfully",
      menu,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= TOGGLE SHOP =================
exports.toggleVendorCard = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor) {
      return res.status(404).json({ msg: "Vendor not found" });
    }

    vendor.isActive = !vendor.isActive;
    vendor.isOpen = vendor.isActive;

    await vendor.save();

    res.json({
      msg: vendor.isActive
        ? "Shop opened successfully"
        : "Shop closed successfully",
      isActive: vendor.isActive,
      isOpen: vendor.isOpen,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= GET VENDORS USER SIDE =================
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({
      collegeId: req.user.collegeId,
      isApproved: true,
    });

    res.json(vendors);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};