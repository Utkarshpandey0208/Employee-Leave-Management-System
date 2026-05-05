require("dotenv").config();

const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const connectDB = require("./config/db");
const User = require("./models/User");
const Leave = require("./models/Leave");

const seed = async () => {
  try {
    await connectDB();

    await Leave.deleteMany({});
    await User.deleteMany({});

    const saltRounds = 10;
    const adminPassword = await bcrypt.hash("admin123", saltRounds);
    const employeePassword = await bcrypt.hash("employee123", saltRounds);

    await User.create([
      {
        name: "Admin User",
        email: "admin@company.com",
        password: adminPassword,
        role: "admin",
        department: "People Ops",
        totalLeaves: 0
      },
      {
        name: "Aarav Sharma",
        email: "aarav@company.com",
        password: employeePassword,
        role: "employee",
        department: "Engineering",
        totalLeaves: 24
      }
    ]);

    console.log("Seed data inserted successfully");
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.connection.close();
  }
};

seed();
