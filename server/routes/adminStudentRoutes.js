import express from "express";

import adminAuth from "../middleware/adminAuth.js";

import {
  getAllStudents,
  deleteStudent,
} from "../controllers/adminStudentController.js";

const router = express.Router();

// Get All Students
router.get("/", adminAuth, getAllStudents);

// Delete Student
router.delete("/:id", adminAuth, deleteStudent);

export default router;