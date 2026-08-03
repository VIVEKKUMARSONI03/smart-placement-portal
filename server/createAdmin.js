import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";

import Admin from "./models/Admin.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const hashedPassword = await bcrypt.hash("admin123", 10);

const exists = await Admin.findOne({
  email: "admin@gmail.com",
});

if (exists) {
  console.log("✅ Admin Already Exists");
  process.exit();
}

await Admin.create({
  name: "Super Admin",
  email: "admin@gmail.com",
  password: hashedPassword,
});

console.log("✅ Admin Created Successfully");

process.exit();