const Order = require("../models/Order");

exports.getVendorStats = async (req, res) => {
  try {
    const vendorId = req.user.id;

    const orders = await Order.find({
      vendorId,
      paymentStatus: "Paid",
    });

    let totalRevenue = 0;
    let afterDiscountRevenue = 0;

    orders.forEach((order) => {
      totalRevenue += order.total;

      order.items.forEach((item) => {
        const price = item.price;
        const qty = item.quantity;

        const discount = item.discount || 0;

        const finalPrice =
          price - (price * discount) / 100;

        afterDiscountRevenue += finalPrice * qty;
      });
    });

    res.json({
      totalOrders: orders.length,
      totalRevenue,
      afterDiscountRevenue,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching vendor stats" });
  }
};