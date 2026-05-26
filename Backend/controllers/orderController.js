const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Vendor = require("../models/Vendor");
const isValidTime = require("../utils/timeCheck");

function generateOrderCode() {
  return "ORD-" + Date.now().toString().slice(-6);
}

// ================= PLACE ORDER =================
exports.placeOrder = async (req, res) => {
  try {
    const { pickupTime } = req.body;

    if (!pickupTime) {
      return res.status(400).json({
        msg: "Pickup time is required",
      });
    }

    const allowed = await isValidTime(req.user.collegeId);

    if (!allowed) {
      return res.status(403).json({
        msg: "Ordering is closed right now",
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ msg: "Cart is empty" });
    }

    const vendorGroups = {};

    cart.items.forEach((item) => {
      const vendorId = item.vendorId.toString();

      if (!vendorGroups[vendorId]) {
        vendorGroups[vendorId] = [];
      }

      vendorGroups[vendorId].push(item);
    });

    const createdOrders = [];

    for (const vendorId in vendorGroups) {
      const items = vendorGroups[vendorId];

      const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      const vendor = await Vendor.findById(vendorId);

      const pickupDay =
        vendor && vendor.isOpen && vendor.isActive
          ? "Today"
          : "Next Day";

      const order = await Order.create({
        user: req.user.id,
        vendorId,
        orderCode: generateOrderCode(),
        items,
        total,
        pickupTime,
        pickupDay,
        collegeId: req.user.collegeId,
        status: "Pending",
        paymentStatus: "Pending",
      });

      createdOrders.push(order);
    }

    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({
      msg: "Order placed successfully",
      orders: createdOrders,
    });
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= USER ORDERS =================
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= ADMIN ORDERS =================
exports.getAllOrdersAdmin = async (req, res) => {
  try {
    const orders = await Order.find({
      collegeId: req.user.collegeId,
    })
      .populate("vendorId", "shopName")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= UPDATE ORDER STATUS =================
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.status = req.body.status;
    await order.save();

    res.json({
      msg: "Order status updated",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= PAYMENT SUCCESS =================
exports.paymentSuccess = async (req, res) => {
  try {
    const { orderId, paymentId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ msg: "Order not found" });
    }

    order.paymentStatus = "Paid";
    order.paymentId = paymentId || "dummy_payment_" + Date.now();

    await order.save();

    res.json({
      msg: "Payment successful",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= VENDOR ORDERS =================
exports.getVendorOrders = async (req, res) => {
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
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("VENDOR ORDER ERROR:", err);
    res.status(500).json({
      msg: "Failed to load vendor orders",
    });
  }
};

// ================= VENDOR COMPLETE ORDER =================
exports.markOrderCompletedByVendor = async (req, res) => {
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

    const order = await Order.findOne({
      _id: req.params.id,
      vendorId: vendor._id,
      collegeId: req.user.collegeId,
    });

    if (!order) {
      return res.status(404).json({
        msg: "Order not found",
      });
    }

    order.status = "Completed";
    await order.save();

    res.json({
      msg: "Order completed successfully",
      order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      msg: "Failed to update order",
    });
  }
};