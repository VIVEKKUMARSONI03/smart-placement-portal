import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";

import {
  getNotifications,
  markAsRead,
} from "../controllers/notificationController.js";

const router = express.Router();

// ==============================
// Get Student Notifications
// ==============================

router.get("/", authMiddleware, getNotifications);

// ==============================
// Mark Notification As Read
// ==============================

router.put("/:id", authMiddleware, markAsRead);

export default router;