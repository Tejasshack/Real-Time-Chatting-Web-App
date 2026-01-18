import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connectDB = async () => {
  const url = process.env.MONGO_URI;

  if (!url) {
    throw new Error("MONGO_URI is not defined in environment variable");
  }
  try {
    await mongoose.connect(url, {
      dbName: "ChatAppMicroServiceApp",
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Failed to Connect to MongoDB " + error);
    process.exit(1);
  }
};

export default connectDB;
