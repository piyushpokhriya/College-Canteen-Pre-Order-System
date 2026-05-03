const jwt = require("jsonwebtoken");

// ================= VERIFY TOKEN =================
const verifyToken = (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }

    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ATTACH USER DATA PROPERLY
    req.user = {
      id: decoded.id,
      role: decoded.role,
      collegeId: decoded.collegeId,
    };

    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

// ================= ROLE CHECKS =================
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ msg: "Admin only" });
  }
  next();
};

const isVendor = (req, res, next) => {
  if (req.user.role !== "vendor") {
    return res.status(403).json({ msg: "Vendor only" });
  }
  next();
};

const isStudent = (req, res, next) => {
  if (req.user.role !== "student") {
    return res.status(403).json({ msg: "Student only" });
  }
  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isVendor,
  isStudent,
};