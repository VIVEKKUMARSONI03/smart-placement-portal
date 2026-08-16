import mongoose from "mongoose";

let connected = false;

export const isDbConnected = () => connected;

const connectDB = async () => {
  if (!process.env.MONGO_URI) {
    throw new Error("MONGO_URI is not defined in environment variables.");
  }

  while (true) {
    try {
      const conn = await mongoose.connect(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 10000,
      });

      connected = true;
      console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      connected = false;
      console.error("❌ MongoDB Connection Failed");
      console.error(error.message);
      console.log("Retrying MongoDB connection in 5 seconds...");
      await new Promise((resolve) => setTimeout(resolve, 5000));
    }
  }
};

export default connectDB;