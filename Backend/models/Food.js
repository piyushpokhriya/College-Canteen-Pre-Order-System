const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema({
  name: String,
  price: Number,
  image: String,
  discount: { type: Number, default: 0 },

  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "College"
  }
});

module.exports = mongoose.model("Food", foodSchema);