const Menu = require("../models/Menu");
const Order = require("../models/Order");
const Vendor = require("../models/Vendor");

// ================= APPLY DISCOUNT =================
exports.applyDiscount = async (req, res) => {
  try {
    const { id } = req.params;
    const { discount } = req.body;

    const menu = await Menu.findById(id);

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

// ================= VENDOR STATS =================
exports.getVendorStats = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const orders = await Order.find({
      vendorId,
      paymentStatus: "Paid",
    });

    let totalRevenue = 0;
    let afterDiscountRevenue = 0;

    for (const order of orders) {
      for (const item of order.items) {
        const itemTotal = item.price * item.quantity;

        totalRevenue += itemTotal;

        const discount = item.discount || 0;

        const final = discount > 0
          ? itemTotal - (itemTotal * discount) / 100
          : itemTotal;

        afterDiscountRevenue += final;
      }
    }

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      afterDiscountRevenue,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Error loading stats" });
  }
};

// ================= TOGGLE SHOP (NEW FEATURE) =================
exports.toggleVendorCard = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.user.id);

    if (!vendor) {
      return res.status(404).json({ msg: "Vendor not found" });
    }

    vendor.isActive = !vendor.isActive;
    await vendor.save();

    res.json({
      msg: "Vendor status updated",
      isActive: vendor.isActive,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= GET VENDORS (USER SIDE FIX) =================
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({
      collegeId: req.user.collegeId,
      isApproved: true,
      isActive: true
    });

    res.json(vendors);

  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server error" });
  }
};