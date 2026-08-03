import express from "express";

import {
    getAllCompanies,
deleteCompany,
   getAllStudents,
   deleteStudent, 
  loginAdmin,
  registerAdmin,
  adminDashboard,
} from "../controllers/adminController.js";

import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

router.post("/register", registerAdmin);

// Login
router.post("/login", loginAdmin);

// Dashboard
router.get("/dashboard", adminAuth, adminDashboard);
// Students
router.get("/students", adminAuth, getAllStudents);

router.delete("/student/:id", adminAuth, deleteStudent);
// Companies

router.get(
  "/companies",
  adminAuth,
  getAllCompanies
);

router.delete(
  "/company/:id",
  adminAuth,
  deleteCompany
);

export default router;