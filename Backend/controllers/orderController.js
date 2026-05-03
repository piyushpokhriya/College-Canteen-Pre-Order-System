const Order = require("../models/Order");
const isValidTime = require("../utils/timeCheck");

exports.placeOrder = async (req, res) => {
  try {
    const { items, total } = req.body;

    // Basic validation
    if (!items || items.length === 0 || !total) {
      return res.status(400).json({ msg: "Invalid order data" });
    }

    // Time restriction check (using utility)
    if (!isValidTime()) {
      return res.status(403).json({
        msg: "Orders are not allowed during class time"
      });
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      total,
      collegeId: req.user.collegeId
    });

    res.status(201).json({ msg: "Order placed", order });

  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};