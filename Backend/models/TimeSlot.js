const mongoose = require("mongoose");

const timeSlotSchema = new mongoose.Schema(
  {
    collegeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },

    startMinutes: {
      type: Number, // e.g. 9:00 = 540
      required: true,
    },

    endMinutes: {
      type: Number, // e.g. 10:50 = 650
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("TimeSlot", timeSlotSchema);