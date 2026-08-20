import express from "express";

import {
  analyzeResume,
} from "../controllers/aiController.js";

const router = express.Router();

// =====================================
// AI Resume Analyzer
// =====================================

router.post(
  "/resume-score",
  analyzeResume
);

export default router;