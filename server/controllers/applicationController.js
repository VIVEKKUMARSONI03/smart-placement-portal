import Application from "../models/Application.js";
import Job from "../models/Job.js";

// Student Apply Job
export const applyJob = async (req, res) => {
  try {
    const { student, job } = req.body;

    const jobExists = await Job.findById(job);

    if (!jobExists) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const alreadyApplied = await Application.findOne({
      student,
      job,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already applied for this job",
      });
    }

    const application = await Application.create({
      student,
      job,
    });

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Get All Applications
export const getApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate("student", "name email")
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "name email",
        },
      });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
// Update Application Status
export const updateApplicationStatus = async (req, res) => {
  try {
    console.log("Body:", req.body);

    const { status } = req.body;
    console.log("Status:", status);

    const application = await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    console.log("Before:", application.status);

    application.status = status;

    await application.save();

    console.log("After:", application.status);

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};