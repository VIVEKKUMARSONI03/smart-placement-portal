import express from "express";

import {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
} from "../controllers/jobController.js";

import companyAuth from "../middleware/companyAuth.js";

const router = express.Router();

// =====================================
// Public Routes (Students)
// =====================================

// Get All Jobs
router.get("/", getJobs);

// Get Single Job
router.get("/:id", getJobById);

// =====================================
// Company Protected Routes
// =====================================

// Create Job
router.post("/create", companyAuth, createJob);

// Get Logged In Company's Jobs
router.get("/company/my-jobs", companyAuth, getMyJobs);

// Update Job
router.put("/:id", companyAuth, updateJob);

// Delete Job
router.delete("/:id", companyAuth, deleteJob);

export default router;