import express from "express";
import {
  createCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
  deleteCompany,
} from "../controllers/companyController.js";

const router = express.Router();
// Create Company
router.post("/create", createCompany);

// Get All Companies
router.get("/", getCompanies);

// Get Single Company
router.get("/:id", getCompanyById);

// Update Company
router.put("/:id", updateCompany);

// Delete Company
router.delete("/:id", deleteCompany);

export default router;