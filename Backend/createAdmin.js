const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  await User.create({
    name: "Super Admin",
    email: "admin@college.com",
    password: hashedPassword,
    role: "admin",
    collegeId: "YOUR_COLLEGE_ID"
  });

  console.log("Admin created");
  process.exit();
}

createAdmin();



