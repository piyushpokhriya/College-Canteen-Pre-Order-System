const mongoose = require("mongoose");

const collegeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    openingTime: String,
    closingTime: String,
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.College ||
  mongoose.model("College", collegeSchema);