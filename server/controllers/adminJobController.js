import Job from "../models/Job.js";

// ==========================
// Get All Jobs
// ==========================

export const getAllJobs = async (req, res) => {
  try {

    const jobs = await Job.find().populate(
      "company",
      "name email"
    );

    res.json({
      success: true,
      jobs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// Delete Job
// ==========================

export const deleteJob = async (req, res) => {

  try {

    const job = await Job.findById(req.params.id);

    if (!job) {

      return res.status(404).json({
        success: false,
        message: "Job not found",
      });

    }

    await Job.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};