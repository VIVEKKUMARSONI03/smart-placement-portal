import express from "express";
import {
  analyzeResume,
  recommendJobs,
} from "../controllers/aiController.js";

const router = express.Router();

router.post("/resume-score", analyzeResume);

router.get("/recommend-jobs", recommendJobs);

export default router;