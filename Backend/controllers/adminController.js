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
      return res.status(404).json({
        msg: "Vendor not found",
      });
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

    res.status(500).json({
      msg: "Server error",
    });
  }
};