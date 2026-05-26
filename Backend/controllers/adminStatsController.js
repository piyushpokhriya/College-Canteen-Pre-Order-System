const Vendor = require("../models/Vendor");
const Order = require("../models/Order");

// ================= ADMIN STATS =================
exports.getAdminStats = async (req, res) => {
  try {
    const collegeId = req.user.collegeId;

    const totalVendors = await Vendor.countDocuments({
      collegeId,
    });

    const pendingVendors = await Vendor.countDocuments({
      collegeId,
      status: "pending",
    });

    const approvedVendors = await Vendor.countDocuments({
      collegeId,
      status: "approved",
    });

    const allVendors = await Vendor.find({
      collegeId,
      status: "approved",
    });

    const orders = await Order.find({
      collegeId,
    }).populate("vendorId", "shopName");

    const paidOrders = orders.filter(
      (order) => order.paymentStatus === "Paid"
    );

    const today = new Date();

    const vendorRevenueMap = {};

    allVendors.forEach((vendor) => {
      vendorRevenueMap[vendor._id.toString()] = {
        vendorId: vendor._id.toString(),
        shopName: vendor.shopName,
        totalRevenue: 0,
        monthlyRevenue: 0,
        todayRevenue: 0,
        totalOrders: 0,
      };
    });

    let totalRevenue = 0;

    paidOrders.forEach((order) => {
      if (!order.vendorId) return;

      const vendorId = order.vendorId._id.toString();

      if (!vendorRevenueMap[vendorId]) {
        vendorRevenueMap[vendorId] = {
          vendorId,
          shopName: order.vendorId.shopName || "Unknown Vendor",
          totalRevenue: 0,
          monthlyRevenue: 0,
          todayRevenue: 0,
          totalOrders: 0,
        };
      }

      totalRevenue += order.total;

      vendorRevenueMap[vendorId].totalRevenue += order.total;
      vendorRevenueMap[vendorId].totalOrders += 1;

      const orderDate = new Date(order.createdAt);

      const isThisMonth =
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear();

      const isToday =
        orderDate.getDate() === today.getDate() &&
        orderDate.getMonth() === today.getMonth() &&
        orderDate.getFullYear() === today.getFullYear();

      if (isThisMonth) {
        vendorRevenueMap[vendorId].monthlyRevenue += order.total;
      }

      if (isToday) {
        vendorRevenueMap[vendorId].todayRevenue += order.total;
      }
    });

    res.json({
      totalVendors,
      pendingVendors,
      approvedVendors,
      totalOrders: orders.length,
      totalRevenue,
      vendors: Object.values(vendorRevenueMap),
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      msg: "Stats error",
    });
  }
};