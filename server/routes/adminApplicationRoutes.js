import express from "express";

import adminAuth from "../middleware/adminAuth.js";

import {
  getAllApplications,
  deleteApplication,
} from "../controllers/adminApplicationController.js";

const router = express.Router();

router.get("/", adminAuth, getAllApplications);

router.delete("/:id", adminAuth, deleteApplication);

export default router;