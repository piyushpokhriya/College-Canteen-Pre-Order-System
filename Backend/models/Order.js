const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor",
      required: true,
    },

    orderCode: {
      type: String,
      unique: true,
    },

    items: [
      {
        menuId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Menu",
        },

        name: String,
        quantity: Number,
        price: Number,

        discount: {
          type: Number,
          default: 0,
        },
      },
    ],

    total: {
      type: Number,
      required: true,
    },

    pickupTime: {
      type: String,
      default: "",
    },

    pickupDay: {
      type: String,
      enum: ["Today", "Next Day"],
      default: "Today",
    },

    status: {
      type: String,
      enum: ["Pending", "Preparing", "Completed", "Cancelled"],
      default: "Pending",
    },

    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed"],
      default: "Pending",
    },

    paymentId: {
      type: String,
      default: "",
    },

    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);