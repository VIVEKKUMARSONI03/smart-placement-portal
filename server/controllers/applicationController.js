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

    const application = await Application.create({
      student: req.student._id,
      company: job.company._id,
      job: jobId,
      status: "Pending",
    });

    // ===============================
    // Create Notification
    // ===============================

    await Notification.create({
      student: req.student._id,
      title: "Job Application Submitted",
      message: `You successfully applied for ${job.title} at ${
        job.company.companyName || job.company.name || "Company"
      }.`,
      type: "application",
    });

    res.status(201).json({
      success: true,
      message: "Application Submitted Successfully",
      application,
    });

  } catch (error) {

    res.status(500).json({
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

    res.json({
      success: true,
      applications,
    });

  } catch (error) {

    res.status(500).json({
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

    const application = await Application.findById(req.params.id)
      .populate("student")
      .populate("job");

    if (!application) {

      return res.status(404).json({
        success: false,
        message: "Application not found",
      });

    }

    application.status = status;

    await application.save();

    // ===============================
    // Notification on Status Change
    // ===============================

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

    if (title) {

      await Notification.create({
        student: application.student._id,
        title,
        message,
        type: status.toLowerCase(),
      });

    }

    res.status(200).json({
      success: true,
      message: "Application status updated successfully",
      application,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};