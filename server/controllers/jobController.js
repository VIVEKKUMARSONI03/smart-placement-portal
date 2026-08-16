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

    // ==============================
    // Basic Validation
    // ==============================

    if (
      !title ||
      !location ||
      !salary ||
      !description ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, location, salary, description and deadline are required",
      });
    }

    // ==============================
    // Validate Deadline
    // ==============================

    const deadlineDate = new Date(deadline);

    if (isNaN(deadlineDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid deadline",
      });
    }

    if (deadlineDate <= new Date()) {
      return res.status(400).json({
        success: false,
        message: "Deadline must be a future date",
      });
    }

    // ==============================
    // Validate Skills
    // ==============================

    let processedSkills = skills;

    if (typeof skills === "string") {
      processedSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);
    }

    if (
      !Array.isArray(processedSkills) ||
      processedSkills.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "At least one skill is required",
      });
    }

    // ==============================
    // Create Job
    // ==============================

    const job = await Job.create({
      title: title.trim(),
      location: location.trim(),
      salary,
      description: description.trim(),
      skills: processedSkills,
      deadline: deadlineDate,
      company: req.company._id,
    });

    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    return res.status(500).json({
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
    const jobs = await Job.find({
      deadline: { $gte: new Date() },
    })
      .populate(
        "company",
        "companyName name email location website"
      )
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    return res.status(500).json({
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
      "companyName name email website location"
    );

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    return res.status(200).json({
      success: true,
      job,
    });
  } catch (error) {
    return res.status(500).json({
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

    // ==============================
    // Validate Deadline if provided
    // ==============================

    if (req.body.deadline) {
      const deadlineDate = new Date(req.body.deadline);

      if (isNaN(deadlineDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: "Invalid deadline",
        });
      }

      if (deadlineDate <= new Date()) {
        return res.status(400).json({
          success: false,
          message: "Deadline must be a future date",
        });
      }

      req.body.deadline = deadlineDate;
    }

    // ==============================
    // Process Skills if provided
    // ==============================

    if (req.body.skills) {
      if (typeof req.body.skills === "string") {
        req.body.skills = req.body.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill.length > 0);
      }

      if (
        !Array.isArray(req.body.skills) ||
        req.body.skills.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "At least one skill is required",
        });
      }
    }

    // ==============================
    // Update Job
    // ==============================

    Object.assign(job, req.body);

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    return res.status(500).json({
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

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
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

    // Only recommend active jobs
    const jobs = await Job.find({
      deadline: { $gte: new Date() },
    }).populate("company", "companyName name location");

    const resumeText = student.resume.toLowerCase();

    const recommendedJobs = jobs.filter((job) => {
      if (!job.skills || job.skills.length === 0) {
        return false;
      }

      return job.skills.some((skill) =>
        resumeText.includes(skill.toLowerCase())
      );
    });

    return res.status(200).json({
      success: true,
      count: recommendedJobs.length,
      jobs: recommendedJobs,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};