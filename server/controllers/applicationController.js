import Application from "../models/Application.js";
import Job from "../models/Job.js";
import Notification from "../models/Notification.js";

// ===================================
// Apply Job
// ===================================

export const applyJob = async (req, res) => {
  try {
    const { jobId } = req.body;

    const job = await Job.findById(jobId).populate(
      "company",
      "companyName name"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ===================================
    // Check Application Deadline
    // ===================================

    if (job.deadline && new Date() > new Date(job.deadline)) {
      return res.status(400).json({
        success: false,
        message: "Application deadline has passed",
      });
    }

    // ===================================
    // Check Duplicate Application
    // ===================================

    const alreadyApplied = await Application.findOne({
      student: req.student._id,
      job: jobId,
    });

    if (alreadyApplied) {
      return res.status(400).json({
        success: false,
        message: "Already Applied",
      });
    }

    // ===================================
    // Create Application
    // ===================================

    const application = await Application.create({
      student: req.student._id,
      company: job.company._id,
      job: jobId,
      status: "Pending",
    });

    // ===================================
    // Create Notification
    // ===================================

    await Notification.create({
      student: req.student._id,
      title: "Job Application Submitted",
      message: `You successfully applied for ${
        job.title
      } at ${
        job.company.companyName ||
        job.company.name ||
        "Company"
      }.`,
      type: "application",
    });

    return res.status(201).json({
      success: true,
      message: "Application Submitted Successfully",
      application,
    });
  } catch (error) {
    // Handle duplicate database index error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "You have already applied for this job",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// My Applications
// ===================================

export const myApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      student: req.student._id,
    })
      .populate("job")
      .populate("company", "companyName name");

    return res.json({
      success: true,
      applications,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ===================================
// Update Application Status
// ===================================

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    // ===================================
    // Validate Status
    // ===================================

    const allowedStatuses = [
      "Pending",
      "Shortlisted",
      "Rejected",
      "Selected",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid application status",
      });
    }

    // ===================================
    // Find Application
    // ===================================

    const application = await Application.findById(req.params.id)
      .populate("student")
      .populate("job")
      .populate("company");

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ===================================
    // Verify Company Ownership
    // ===================================

    if (
      !req.company ||
      !application.company ||
      application.company._id.toString() !==
        req.company._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not authorized to update this application",
      });
    }

    // ===================================
    // Update Status
    // ===================================

    application.status = status;

    await application.save();

    // ===================================
    // Notification on Status Change
    // ===================================

    let title = "";
    let message = "";

    if (status === "Shortlisted") {
      title = "Congratulations 🎉";
      message = `You have been shortlisted for ${application.job.title}.`;
    } else if (status === "Selected") {
      title = "Congratulations 🥳";
      message = `You have been selected for ${application.job.title}.`;
    } else if (status === "Rejected") {
      title = "Application Update";
      message = `Your application for ${application.job.title} was rejected.`;
    }

    // ===================================
    // Create Notification
    // ===================================

    if (title) {
      await Notification.create({
        student: application.student._id,
        title,
        message,
        type: status.toLowerCase(),
      });
    }

    return res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};