const Menu = require("../models/Menu");

// ================= APPLY DISCOUNT =================
exports.applyDiscount = async (req, res) => {
  try {
    const { discount } = req.body;

    // validation
    if (discount === undefined) {
      return res.status(400).json({ msg: "Discount value required" });
    }

    if (discount < 0 || discount > 100) {
      return res.status(400).json({ msg: "Discount must be between 0-100" });
    }

    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ msg: "Menu item not found" });
    }

    // apply discount
    menu.discount = discount;
    await menu.save();

    res.json({
      msg: "Discount applied successfully",
      menu
    });

  } catch (error) {
    console.error("Apply Discount Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};