import express from "express";

import {
  registerCompany,
  loginCompany,
  getCompanies,
  getApplicants,
} from "../controllers/companyController.js";

import companyAuth from "../middleware/companyAuth.js";

const router = express.Router();

// =========================
// Public Routes
// =========================

router.post("/register", registerCompany);

router.post("/login", loginCompany);

router.get("/", getCompanies);

// =========================
// Protected Routes
// =========================

// Get all applicants of logged-in company
router.get("/applicants", companyAuth, getApplicants);

export default router;