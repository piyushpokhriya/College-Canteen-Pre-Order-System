const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const readline = require("readline");

const User = require("./models/User");
const College = require("./models/College");

require("dotenv").config();

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  // console.log("MongoDB Connected");
  console.log("Connected DB:", mongoose.connection.name);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function ask(q) {
    return new Promise((resolve) => rl.question(q, resolve));
  }

  console.log("\nSetup Admin + College\n");

  const collegeName = await ask("College Name: ");

  const college = await College.create({ name: collegeName });
  console.log("College Created:", college._id);

  const name = await ask("Admin Name: ");
  const email = await ask("Admin Email: ");
  const password = await ask("Admin Password: ");

  const hashedPassword = await bcrypt.hash(password, 10);

  await User.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    collegeId: college._id,
  });

  console.log("Admin Created Successfully");

  rl.close();
  mongoose.connection.close();
}

main();