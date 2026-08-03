import express from "express";

import adminAuth from "../middleware/adminAuth.js";

import {
  getAllJobs,
  deleteJob,
} from "../controllers/adminJobController.js";

const router = express.Router();

// Get All Jobs
router.get("/", adminAuth, getAllJobs);

// Delete Job
router.delete("/:id", adminAuth, deleteJob);

export default router;