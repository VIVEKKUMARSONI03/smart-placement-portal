import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  registerStudent,
  loginStudent,
  getProfile,
  updateProfile,
  updateResume,
} from "../controllers/studentController.js";

const router = express.Router();

// ==============================
// Authentication
// ==============================

router.post("/register", registerStudent);

router.post("/login", loginStudent);

// ==============================
// Student Profile
// ==============================

router.get("/profile", authMiddleware, getProfile);

router.put("/profile", authMiddleware, updateProfile);

// ==============================
// Resume
// ==============================

router.put("/resume", authMiddleware, updateResume);

export default router;