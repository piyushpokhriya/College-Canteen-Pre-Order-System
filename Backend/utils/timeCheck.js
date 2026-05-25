const College = require("../models/College");

module.exports = async function isValidTime(collegeId) {
  try {
    const college = await College.findById(collegeId);

    if (!college || !college.orderStartTime || !college.orderEndTime) {
      return false;
    }

    const now = new Date();

    const currentTime = now.getHours() * 60 + now.getMinutes();

    const [startH, startM] = college.orderStartTime.split(":");
    const [endH, endM] = college.orderEndTime.split(":");

    const start = Number(startH) * 60 + Number(startM);
    const end = Number(endH) * 60 + Number(endM);

    // normal case (same day window)
    if (start <= end) {
      return currentTime >= start && currentTime <= end;
    }

    // overnight case (e.g. 10 PM to 2 AM)
    return currentTime >= start || currentTime <= end;

  } catch (err) {
    console.error("Time Check Error:", err);
    return false;
  }
};