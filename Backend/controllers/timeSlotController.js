const TimeSlot = require("../models/TimeSlot");

// ADD SLOT (ADMIN)
exports.addTimeSlot = async (req, res) => {
  try {
    const { startMinutes, endMinutes } = req.body;

    const slot = await TimeSlot.create({
      collegeId: req.user.collegeId,
      startMinutes,
      endMinutes,
    });

    res.json({ msg: "Time slot added", slot });
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
};

// GET SLOTS
exports.getSlots = async (req, res) => {
  const slots = await TimeSlot.find({
    collegeId: req.user.collegeId,
  });

  res.json(slots);
};

// DELETE SLOT
exports.deleteSlot = async (req, res) => {
  await TimeSlot.findByIdAndDelete(req.params.id);
  res.json({ msg: "Deleted" });
};