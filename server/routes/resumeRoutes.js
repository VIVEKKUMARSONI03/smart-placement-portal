import express from "express";

import {
  uploadResume,
  getResume,
} from "../controllers/resumeController.js";

import studentAuth from "../middleware/studentAuth.js";
import uploadResumeMiddleware from "../middleware/uploadResume.js";

const router = express.Router();

// ===================================
// Upload Resume
// ===================================

router.post(
  "/upload",
  studentAuth,
  uploadResumeMiddleware.single("resume"),
  uploadResume
);

// ===================================
// Get Resume
// ===================================

router.get(
  "/my-resume",
  studentAuth,
  getResume
);

export default router;