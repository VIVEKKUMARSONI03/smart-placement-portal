import applicationRoutes from "./routes/applicationRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import connectDB from "./config/db.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";
import studentRoutes from "./routes/studentRoutes.js";


dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();
connectDB();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use("/api/students", studentRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Smart Placement Portal API is Running 🚀",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});