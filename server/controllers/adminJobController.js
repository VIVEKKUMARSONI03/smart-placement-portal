import Job from "../models/Job.js";
import Application from "../models/Application.js";

// =====================================
// Get All Jobs
// =====================================

export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate(
        "company",
        "companyName name email location"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Admin Get Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to fetch jobs",
    });
  }
};

// =====================================
// Delete Job
// =====================================

export const deleteJob = async (req, res) => {
  try {
    // =================================
    // Find Job
    // =================================

    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // =================================
    // Delete Applications For This Job
    // =================================

    await Application.deleteMany({
      job: job._id,
    });

    // =================================
    // Delete Job
    // =================================

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Job and related applications deleted successfully",
    });
  } catch (error) {
    console.error("Admin Delete Job Error:", error);

    // Invalid MongoDB ObjectId
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to delete job",
    });
  }
};