import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";
import uploadProfileImage from "../middleware/uploadProfileImage.js";

import {
  registerStudent,
  loginStudent,
  getProfile,
  updateProfile,
  updateResume,
  changePassword,
  uploadProfileImage as uploadProfileImageController,
  removeProfileImage,
} from "../controllers/studentController.js";

const router = express.Router();

// =====================================
// Authentication
// =====================================

router.post("/register", registerStudent);

router.post("/login", loginStudent);

// =====================================
// Student Profile
// =====================================

router.get(
  "/profile",
  authMiddleware,
  getProfile
);

router.put(
  "/profile",
  authMiddleware,
  updateProfile
);

// =====================================
// Profile Picture Upload
// =====================================

router.post(
  "/profile-image",
  authMiddleware,
  uploadProfileImage.single("profileImage"),
  uploadProfileImageController
);

// =====================================
// Remove Profile Picture
// =====================================

router.delete(
  "/profile-image",
  authMiddleware,
  removeProfileImage
);

// =====================================
// Resume
// =====================================

router.put(
  "/resume",
  authMiddleware,
  updateResume
);

// =====================================
// Change Password
// =====================================

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

export default router;