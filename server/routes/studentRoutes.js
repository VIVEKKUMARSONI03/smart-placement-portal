import authMiddleware from "../middleware/authMiddleware.js";
import express from "express";
import {
  registerStudent,
  loginStudent,
  getProfile,
} from "../controllers/studentController.js";


const router = express.Router();

router.post("/register", registerStudent);
router.post("/login", loginStudent);
router.get("/profile", authMiddleware, getProfile);

export default router;