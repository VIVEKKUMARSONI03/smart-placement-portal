import express from "express";

import {
  applyJob,
  myApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import studentAuth from "../middleware/studentAuth.js";
import companyAuth from "../middleware/companyAuth.js";

const router = express.Router();

// ===================================
// Student Routes
// ===================================

// Apply Job
router.post("/apply", studentAuth, applyJob);

// My Applications
router.get("/my-applications", studentAuth, myApplications);

// ===================================
// Company Routes
// ===================================

// Update Application Status
router.put(
  "/:id/status",
  companyAuth,
  updateApplicationStatus
);

export default router;