const Cart = require("../models/Cart");
const Menu = require("../models/Menu");

// ================= ADD TO CART =================
exports.addToCart = async (req, res) => {
  try {
    const { menuId, quantity } = req.body;

    const qty = Number(quantity) || 1;

    if (qty < 1) {
      return res.status(400).json({
        msg: "Quantity must be at least 1",
      });
    }

    const menu = await Menu.findById(menuId);

    if (!menu) {
      return res.status(404).json({ msg: "Item not found" });
    }

    let cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      cart = new Cart({
        userId: req.user.id,
        collegeId: req.user.collegeId,
        items: [],
      });
    }

    const existing = cart.items.find(
      (i) => i.menuId.toString() === menuId
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({
        menuId: menu._id,
        vendorId: menu.vendorId,
        name: menu.name,
        image: menu.image,
        price: menu.price,
        quantity: qty,
      });
    }

    await cart.save();

    res.json({
      msg: "Added to cart",
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= GET CART =================
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.user.id,
    }).populate("items.vendorId", "shopName isActive isOpen");

    res.json(cart || { items: [] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= UPDATE QUANTITY =================
exports.updateCartQuantity = async (req, res) => {
  try {
    const { menuId } = req.params;
    const { quantity } = req.body;

    const qty = Number(quantity);

    if (!qty || qty < 1) {
      return res.status(400).json({
        msg: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    const item = cart.items.find(
      (i) => i.menuId.toString() === menuId
    );

    if (!item) {
      return res.status(404).json({
        msg: "Item not found in cart",
      });
    }

    item.quantity = qty;

    await cart.save();

    res.json({
      msg: "Quantity updated",
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= REMOVE ITEM =================
exports.removeFromCart = async (req, res) => {
  try {
    const { menuId } = req.params;

    const cart = await Cart.findOne({ userId: req.user.id });

    if (!cart) {
      return res.status(404).json({ msg: "Cart not found" });
    }

    cart.items = cart.items.filter(
      (i) => i.menuId.toString() !== menuId
    );

    await cart.save();

    res.json({
      msg: "Item removed",
      cart,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= CLEAR CART =================
exports.clearCart = async (req, res) => {
  try {
    await Cart.findOneAndDelete({ userId: req.user.id });

    res.json({ msg: "Cart cleared" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};