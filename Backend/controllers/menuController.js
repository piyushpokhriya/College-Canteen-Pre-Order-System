const Menu = require("../models/Menu");
const Vendor = require("../models/Vendor");

// ================= CREATE MENU ITEM =================
exports.createMenu = async (req, res) => {
  try {
    const { name, price } = req.body;

    if (!name || !price) {
      return res.status(400).json({ msg: "Name and price are required" });
    }

    console.log("USER:", req.user);

    const vendor = await Vendor.findOne({
      owner: req.user.id
    });

    if (!vendor) {
      return res.status(400).json({ msg: "Vendor not found" });
    }

    const newItem = await Menu.create({
      name,
      price: Number(price),
      image: req.file ? req.file.filename : "",
      vendorId: vendor._id,
      collegeId: req.user.collegeId,
      discount: 0
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      data: newItem
    });

  } catch (error) {
    console.error("Create Menu Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= GET ALL MENU =================
exports.getAllMenu = async (req, res) => {
  try {
    const { vendorId } = req.query;

    let query = {
      collegeId: req.user.collegeId
    };

    if (vendorId && vendorId !== "all") {
      query.vendorId = vendorId;
    }

    console.log("QUERY:", query);

    const items = await Menu.find(query);

    const updatedItems = items.map(item => {
      const finalPrice =
        item.price - (item.price * item.discount) / 100;

      return {
        ...item._doc,
        finalPrice
      };
    });

    res.json(updatedItems);

  } catch (error) {
    console.error("Get Menu Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= GET VENDOR MENU =================
exports.getVendorMenu = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({
      owner: req.user.id
    });

    if (!vendor) {
      return res.status(400).json({ msg: "Vendor not found" });
    }

    const items = await Menu.find({
      vendorId: vendor._id
    });

    res.json(items);

  } catch (error) {
    console.error("Vendor Menu Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= UPDATE MENU =================
exports.updateMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ msg: "Menu not found" });
    }

    const vendor = await Vendor.findOne({
      owner: req.user.id
    });

    if (!vendor || menu.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    const { name, price } = req.body;

    const updated = await Menu.findByIdAndUpdate(
      req.params.id,
      {
        name,
        price,
        image: req.file ? req.file.filename : menu.image
      },
      { new: true }
    );

    res.json(updated);

  } catch (error) {
    console.error("Update Menu Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= DELETE MENU =================
exports.deleteMenu = async (req, res) => {
  try {
    const menu = await Menu.findById(req.params.id);

    if (!menu) {
      return res.status(404).json({ msg: "Menu not found" });
    }

    const vendor = await Vendor.findOne({
      owner: req.user.id
    });

    if (!vendor || menu.vendorId.toString() !== vendor._id.toString()) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await menu.deleteOne();

    res.json({ msg: "Menu deleted successfully" });

  } catch (error) {
    console.error("Delete Menu Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};


// ================= TOP ITEMS =================
exports.getTopItems = async (req, res) => {
  try {
    const items = await Menu.find({
      collegeId: req.user.collegeId
    })
      .sort({ price: 1 })
      .limit(6);

    res.json(items);

  } catch (error) {
    console.error("Top Items Error:", error.message);
    res.status(500).json({ msg: "Server error" });
  }
};