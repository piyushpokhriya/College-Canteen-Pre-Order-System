const Order = require("../models/Order");
const Cart = require("../models/Cart");
const isValidTime = require("../utils/timeCheck");

// ================= PLACE ORDER =================
exports.placeOrder = async (req, res) => {
  try {
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

    const total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );

    const order = await Order.create({
      user: req.user.id,
      vendorId: cart.items[0].vendorId,
      items: cart.items,
      total,
      collegeId: req.user.collegeId,
      status: "Pending",
      paymentStatus: "Pending",
    });

    await Cart.findOneAndDelete({ userId: req.user.id });

    res.status(201).json({
      msg: "Order placed successfully",
      order,
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
      .populate("user", "name email")
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
    order.paymentId = paymentId;

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
    const vendorId = req.user.id;

    const orders = await Order.find({ vendorId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("VENDOR ORDER ERROR:", err);
    res.status(500).json({ msg: "Failed to load vendor orders" });
  }
};