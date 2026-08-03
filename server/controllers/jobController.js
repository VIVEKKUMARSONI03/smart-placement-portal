import Job from "../models/Job.js";
import Student from "../models/Student.js";

// ==============================
// Create Job
// ==============================

export const createJob = async (req, res) => {
  try {
    const {
      title,
      location,
      salary,
      description,
      skills,
      deadline,
    } = req.body;

    const job = await Job.create({
      title,
      location,
      salary,
      description,
      skills,
      deadline,
      company: req.company._id,
    });

    res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get All Jobs (Student)
// ==============================

export const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name email location website")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get My Jobs (Company)
// ==============================

export const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      company: req.company._id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Get Single Job
// ==============================

export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "company",
      "name email website location"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Update Job
// ==============================

export const updateJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      company: req.company._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    Object.assign(job, req.body);

    await job.save();

    res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Delete Job
// ==============================

export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findOne({
      _id: req.params.id,
      company: req.company._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await job.deleteOne();

    res.status(200).json({
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
// ==============================
// Recommended Jobs (AI)
// ==============================

export const getRecommendedJobs = async (req, res) => {
  try {

    const student = await Student.findById(req.student._id);

    if (!student || !student.resume) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first",
      });
    }

    const jobs = await Job.find().populate(
      "company",
      "name location"
    );

    const resumeText = student.resume.toLowerCase();

    const recommendedJobs = jobs.filter((job) => {

      if (!job.skills || job.skills.length === 0) return false;

      return job.skills.some((skill) =>
        resumeText.includes(skill.toLowerCase())
      );

    });

    res.status(200).json({
      success: true,
      count: recommendedJobs.length,
      jobs: recommendedJobs,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};