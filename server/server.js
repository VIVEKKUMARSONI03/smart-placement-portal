import path from "path";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns";

import connectDB, { isDbConnected } from "./config/db.js";

import studentRoutes from "./routes/studentRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import adminStudentRoutes from "./routes/adminStudentRoutes.js";
import adminCompanyRoutes from "./routes/adminCompanyRoutes.js";
import adminJobRoutes from "./routes/adminJobRoutes.js";
import adminApplicationRoutes from "./routes/adminApplicationRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";

import searchRoutes from "./routes/searchRoutes.js";

import aiRoutes from "./routes/aiRoutes.js";
import aiJobRoutes from "./routes/aiJobRoutes.js";

import notificationRoutes from "./routes/notificationRoutes.js";

// =======================
// Environment
// =======================

dotenv.config();

// =======================
// DNS
// =======================

dns.setServers(["1.1.1.1", "8.8.8.8"]);

// =======================
// Database
// =======================

connectDB();

// =======================
// Express App
// =======================

const app = express();

// =======================
// Middlewares
// =======================
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

app.use("/api", (req, res, next) => {
  if (!isDbConnected()) {
    return res.status(503).json({
      success: false,
      message: "Service unavailable: database is not connected yet.",
    });
  }
  next();
});

app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "uploads"))
);

  // =======================
  // Student Routes
  // =======================
  app.use("/api/students", studentRoutes);

  // =======================
  // Company Routes
  // =======================
  app.use("/api/company", companyRoutes);

  // =======================
  // Job Routes
  // =======================
  app.use("/api/jobs", jobRoutes);

  // =======================
  // Application Routes
  // =======================
  app.use("/api/applications", applicationRoutes);

  // =======================
  // Resume Routes
  // =======================
  app.use("/api/resume", resumeRoutes);

  // =======================
  // Admin Routes
  // =======================
  app.use("/api/admin", adminRoutes);
  app.use("/api/admin/students", adminStudentRoutes);
  app.use("/api/admin/company", adminCompanyRoutes);
  app.use("/api/admin/jobs", adminJobRoutes);
  app.use("/api/admin/applications", adminApplicationRoutes);

  // =======================
  // Analytics Routes
  // =======================
  app.use("/api/analytics", analyticsRoutes);

  // =======================
  // Search Routes
  // =======================
  app.use("/api/search", searchRoutes);

  // =======================
  // AI Routes
  // =======================
  app.use("/api/ai", aiRoutes);
  app.use("/api/ai/jobs", aiJobRoutes);

  // =======================
  // Notification Routes
  // =======================
  app.use("/api/notifications", notificationRoutes);

  // =======================
  // Test Route
  // =======================
  app.get("/", (req, res) => {
    res.status(200).json({
      success: true,
      message: "Smart Placement Portal API is Running 🚀",
    });
  });

  // =======================
  // 404 Route
  // =======================
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "API route not found",
    });
  });

  // =======================
  // Global Error Handler
  // =======================
  app.use((err, req, res, next) => {
    console.error("Server Error:", err);
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Internal Server Error",
    });
  });

const PORT = process.env.PORT || 5000;
const HOST = "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Server listening on ${HOST}:${PORT}`);
});
