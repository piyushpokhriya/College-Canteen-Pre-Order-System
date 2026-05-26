const Order = require("../models/Order");
const Vendor = require("../models/Vendor");

function isSameDate(d1, d2) {
  return (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );
}

function getFinalAmount(order) {
  let amount = 0;

  order.items.forEach((item) => {
    const discount = item.discount || 0;
    const finalPrice = item.price - (item.price * discount) / 100;
    amount += finalPrice * item.quantity;
  });

  return amount;
}

function getTopItem(orders) {
  const itemMap = {};

  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!itemMap[item.name]) itemMap[item.name] = 0;
      itemMap[item.name] += item.quantity;
    });
  });

  let topItem = "No sales yet";
  let maxQty = 0;

  Object.keys(itemMap).forEach((name) => {
    if (itemMap[name] > maxQty) {
      maxQty = itemMap[name];
      topItem = name;
    }
  });

  return topItem;
}

function calculateStats(orders) {
  let totalRevenue = 0;
  let afterDiscountRevenue = 0;

  orders.forEach((order) => {
    totalRevenue += order.total;
    afterDiscountRevenue += getFinalAmount(order);
  });

  return {
    totalRevenue,
    afterDiscountRevenue,
    totalOrders: orders.length,
  };
}

exports.getVendorStats = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor) {
      return res.status(404).json({
        msg: "Vendor profile not found",
      });
    }

    const orders = await Order.find({
      vendorId: vendor._id,
      collegeId: req.user.collegeId,
      paymentStatus: "Paid",
    });

    const now = new Date();

    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    const weekStart = new Date();
    weekStart.setDate(now.getDate() - 7);

    const todayOrders = orders.filter((order) =>
      isSameDate(new Date(order.createdAt), now)
    );

    const yesterdayOrders = orders.filter((order) =>
      isSameDate(new Date(order.createdAt), yesterday)
    );

    const weekOrders = orders.filter(
      (order) => new Date(order.createdAt) >= weekStart
    );

    const monthOrders = orders.filter((order) => {
      const d = new Date(order.createdAt);
      return (
        d.getMonth() === now.getMonth() &&
        d.getFullYear() === now.getFullYear()
      );
    });

    res.json({
      allTime: calculateStats(orders),
      thisMonth: calculateStats(monthOrders),
      today: calculateStats(todayOrders),
      yesterday: calculateStats(yesterdayOrders),

      topSelling: {
        today: getTopItem(todayOrders),
        thisWeek: getTopItem(weekOrders),
        thisMonth: getTopItem(monthOrders),
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Error fetching vendor stats",
    });
  }
};