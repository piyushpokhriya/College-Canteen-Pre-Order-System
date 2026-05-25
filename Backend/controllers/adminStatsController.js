const Vendor = require("../models/Vendor");
const Order = require("../models/Order");

// ================= ADMIN STATS =================
exports.getAdminStats = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const totalVendors =
      await Vendor.countDocuments({ collegeId });

    const pendingVendors =
      await Vendor.countDocuments({
        collegeId,
        status: "pending",
      });

    const approvedVendors =
      await Vendor.countDocuments({
        collegeId,
        status: "approved",
      });

    const orders = await Order.find({
      collegeId,
    }).populate("vendorId", "shopName");

    let totalRevenue = 0;

    const vendorRevenueMap = {};

    orders.forEach((order) => {

      if (order.paymentStatus === "Paid") {
        totalRevenue += order.total;
      }

      if (order.vendorId) {

        const id = order.vendorId._id.toString();

        if (!vendorRevenueMap[id]) {
          vendorRevenueMap[id] = {
            shopName: order.vendorId.shopName,
            revenue: 0,
          };
        }

        vendorRevenueMap[id].revenue += order.total;
      }
    });

    res.json({
      totalVendors,
      pendingVendors,
      approvedVendors,
      totalOrders: orders.length,
      totalRevenue,
      vendorRevenueMap,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Stats error",
    });
  }
};