function isValidTime() {
  const now = new Date();

  const h = now.getHours();
  const m = now.getMinutes();

  const t = h * 60 + m;

  const blocked = [
    [540, 650],  // 9:00 - 10:50
    [690, 800]   // 11:30 - 1:20
  ];

  for (let [start, end] of blocked) {
    if (t >= start && t <= end) {
      return false;
    }
  }

  return true;
}

module.exports = isValidTime;