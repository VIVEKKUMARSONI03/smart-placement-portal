import express from "express";

import companyAuth from "../middleware/companyAuth.js";
import uploadCompanyLogo from "../middleware/uploadCompanyLogo.js";

import {
  registerCompany,
  loginCompany,
  getCompanies,
  getApplicants,
  getCompanyProfile,
  updateCompanyProfile,
  uploadCompanyLogo as uploadCompanyLogoController,
  removeCompanyLogo,
  changeCompanyPassword,
} from "../controllers/companyController.js";

const router = express.Router();

// =====================================
// Public Routes
// =====================================

router.post(
  "/register",
  registerCompany
);

router.post(
  "/login",
  loginCompany
);

router.get(
  "/",
  getCompanies
);

// =====================================
// Company Profile
// =====================================

router.get(
  "/profile",
  companyAuth,
  getCompanyProfile
);

router.put(
  "/profile",
  companyAuth,
  updateCompanyProfile
);

// =====================================
// Company Logo
// =====================================

router.post(
  "/logo",
  companyAuth,
  uploadCompanyLogo.single("logo"),
  uploadCompanyLogoController
);

router.delete(
  "/logo",
  companyAuth,
  removeCompanyLogo
);

// =====================================
// Change Password
// =====================================

router.put(
  "/change-password",
  companyAuth,
  changeCompanyPassword
);

// =====================================
// Applicants
// =====================================

router.get(
  "/applicants",
  companyAuth,
  getApplicants
);

export default router;