const Vendor = require("../models/Vendor");

// ================= GET PENDING VENDORS =================
exports.getPendingVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find({
      collegeId: req.user.collegeId,
      status: "pending",
    }).populate("owner", "name email");

    res.json(vendors);

  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Server error",
    });
  }
};