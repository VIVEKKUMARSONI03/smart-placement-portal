import express from "express";

import adminAuth from "../middleware/adminAuth.js";

import {
  getAllCompanies,
  deleteCompany,
} from "../controllers/adminCompanyController.js";

const router = express.Router();

// Get All Companies
router.get("/", adminAuth, getAllCompanies);

// Delete Company
router.delete("/:id", adminAuth, deleteCompany);

export default router;