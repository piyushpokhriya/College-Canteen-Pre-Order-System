const TimeSlot = require("../models/TimeSlot");

module.exports = async function isValidTime(collegeId) {
  try {
    const now = new Date();

    const currentMinutes =
      now.getHours() * 60 + now.getMinutes();

    const blockedSlot = await TimeSlot.findOne({
      collegeId,
      startMinutes: { $lte: currentMinutes },
      endMinutes: { $gte: currentMinutes },
    });

    if (blockedSlot) {
      return false; // class/blocked time hai
    }

    return true; // baaki time order allowed
  } catch (err) {
    console.error("Time Check Error:", err);
    return true;
  }
};