import express from "express";

import {
  uploadResume,
  getResume,
  deleteResume,
} from "../controllers/resumeController.js";

import studentAuth from "../middleware/studentAuth.js";

import uploadResumeMiddleware from "../middleware/uploadResume.js";

const router = express.Router();

// ===================================
// Upload / Replace Resume
// ===================================

router.post(
  "/upload",
  studentAuth,
  uploadResumeMiddleware.single(
    "resume"
  ),
  uploadResume
);

// ===================================
// Get Current Resume
// ===================================

router.get(
  "/my-resume",
  studentAuth,
  getResume
);

// ===================================
// Delete Resume
// ===================================

router.delete(
  "/delete",
  studentAuth,
  deleteResume
);

export default router;