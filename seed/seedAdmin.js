import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../modals/User.js";

dotenv.config();

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existing = await User.findOne({ email: "ali.raza@luminaearthminerals.com" });

    if (existing) {
      console.log("Admin already exists");
      process.exit();
    }

    await User.create({
      email: "ali.raza@luminaearthminerals.com",
      password: "Gold1212!", // will be hashed automatically
    });

    console.log("Admin created successfully");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedAdmin();