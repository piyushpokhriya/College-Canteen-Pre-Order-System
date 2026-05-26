const Menu = require("../models/Menu");
const Vendor = require("../models/Vendor");

// ================= CREATE MENU ITEM =================
const createMenu = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ msg: "Name and price required" });
    }

    const vendor = await Vendor.findOne({
      owner: req.user.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor) {
      return res.status(400).json({ msg: "Vendor not found" });
    }

    const item = await Menu.create({
      name,
      price: Number(price),
      image: req.file ? req.file.filename : "",
      vendorId: vendor._id,
      collegeId: req.user.collegeId,
      discount: 0,
      isAvailable: true,
    });

    res.status(201).json({
      msg: "Menu item created",
      item,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= GET ALL MENU =================
const getAllMenu = async (req, res) => {
  try {
    const { vendorId } = req.query;

    let query = {
      collegeId: req.user.collegeId,
      isAvailable: true,
    };

    if (vendorId && vendorId !== "all") {
      query.vendorId = vendorId;
    }

    const items = await Menu.find(query)
      .populate("vendorId", "shopName isActive isOpen");

    const result = items.map((item) => {
      const finalPrice =
        item.price - (item.price * item.discount) / 100;

      return {
        ...item._doc,
        finalPrice,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= GET VENDOR MENU =================
const getVendorMenu = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor) {
      return res.status(400).json({ msg: "Vendor not found" });
    }

    const items = await Menu.find({ vendorId: vendor._id });

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= UPDATE MENU =================
const updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) return res.status(404).json({ msg: "Not found" });

    const vendor = await Vendor.findOne({
      owner: req.user.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor || menu.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        price: req.body.price,
        image: req.file ? req.file.filename : menu.image,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= DELETE MENU =================
const deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) return res.status(404).json({ msg: "Not found" });

    const vendor = await Vendor.findOne({
      owner: req.user.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor || menu.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await menu.deleteOne();

    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= APPLY DISCOUNT =================
const applyDiscount = async (req, res) => {
  try {
    const { discount } = req.body;

    if (discount === undefined) {
      return res.status(400).json({ msg: "Discount required" });
    }

    if (discount < 0 || discount > 100) {
      return res.status(400).json({ msg: "Invalid discount" });
    }

    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ msg: "Item not found" });
    }

    const vendor = await Vendor.findOne({
      owner: req.user.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor || menu.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    menu.discount = discount;
    await menu.save();

    res.json({ msg: "Discount updated", menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= TOGGLE AVAILABILITY =================
const toggleAvailability = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ msg: "Not found" });
    }

    const vendor = await Vendor.findOne({
      owner: req.user.id,
      collegeId: req.user.collegeId,
    });

    if (!vendor || menu.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    menu.isAvailable = !menu.isAvailable;
    await menu.save();

    res.json({ msg: "Updated", menu });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

// ================= TOP ITEMS =================
const getTopItems = async (req, res) => {
  try {
    const items = await Menu.find({
      collegeId: req.user.collegeId,
      isAvailable: true,
    })
      .populate("vendorId", "shopName isActive isOpen")
      .sort({ price: 1 })
      .limit(6);

    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = {
  createMenu,
  getAllMenu,
  getVendorMenu,
  updateMenu,
  deleteMenu,
  applyDiscount,
  toggleAvailability,
  getTopItems,
};