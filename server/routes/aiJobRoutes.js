import express from "express";
import { recommendJobs } from "../controllers/aiJobController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// AI Job Recommendation
router.get("/recommend", authMiddleware, recommendJobs);

export default router;