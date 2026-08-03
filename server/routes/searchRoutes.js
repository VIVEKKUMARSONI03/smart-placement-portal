import express from "express";

import {
  searchStudents,
  searchCompanies,
  searchJobs,
  searchApplications,
} from "../controllers/searchController.js";

const router = express.Router();

router.get("/students", searchStudents);

router.get("/companies", searchCompanies);

router.get("/jobs", searchJobs);

router.get("/applications", searchApplications);

export default router;