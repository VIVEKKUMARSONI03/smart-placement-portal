import express from "express";
import {
  applyJob,
  getApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

const router = express.Router();

router.post("/apply", applyJob);

router.get("/", getApplications);

router.put("/:id", updateApplicationStatus);

export default router;