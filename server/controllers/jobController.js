import Job from "../models/Job.js";
import Student from "../models/Student.js";
import Application from "../models/Application.js";

// ===================================
// Create Job
// ===================================

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

    if (
      !title ||
      !location ||
      salary === undefined ||
      salary === null ||
      salary === "" ||
      !description ||
      !deadline
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Title, location, salary, description and deadline are required",
      });
    }

    if (!req.company?._id) {
      return res.status(401).json({
        success: false,
        message: "Company authentication required",
      });
    }

    // ===================================
    // Validate Salary
    // ===================================

    const numericSalary = Number(salary);

    if (Number.isNaN(numericSalary) || numericSalary < 0) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid salary",
      });
    }

    // ===================================
    // Validate Deadline
    // ===================================

    const deadlineDate = new Date(deadline);

    if (Number.isNaN(deadlineDate.getTime())) {
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

    // ===================================
    // Process Skills
    // ===================================

    let processedSkills = skills;

    if (typeof processedSkills === "string") {
      processedSkills = processedSkills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
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

    processedSkills = [
      ...new Set(
        processedSkills
          .map((skill) => String(skill).trim())
          .filter(Boolean)
      ),
    ];

    // ===================================
    // Create Job
    // ===================================

    const job = await Job.create({
      title: title.trim(),
      location: location.trim(),
      salary: numericSalary,
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
    console.error("Create Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to create job",
    });
  }
};

// ===================================
// Get All Active Jobs - Student
// ===================================

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
    console.error("Get Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch jobs",
    });
  }
};

// ===================================
// Get My Jobs - Company
// ===================================

export const getMyJobs = async (req, res) => {
  try {
    if (!req.company?._id) {
      return res.status(401).json({
        success: false,
        message: "Company authentication required",
      });
    }

    const jobs = await Job.find({
      company: req.company._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Get My Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch company jobs",
    });
  }
};

// ===================================
// Get Single Job
// ===================================

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
    console.error("Get Job Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to fetch job",
    });
  }
};

// ===================================
// Update Job - Company
// ===================================

export const updateJob = async (req, res) => {
  try {
    if (!req.company?._id) {
      return res.status(401).json({
        success: false,
        message: "Company authentication required",
      });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      company: req.company._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not authorized",
      });
    }

    const {
      title,
      location,
      salary,
      description,
      skills,
      deadline,
    } = req.body;

    // ===================================
    // Update Title
    // ===================================

    if (title !== undefined) {
      if (!String(title).trim()) {
        return res.status(400).json({
          success: false,
          message: "Title cannot be empty",
        });
      }

      job.title = String(title).trim();
    }

    // ===================================
    // Update Location
    // ===================================

    if (location !== undefined) {
      if (!String(location).trim()) {
        return res.status(400).json({
          success: false,
          message: "Location cannot be empty",
        });
      }

      job.location = String(location).trim();
    }

    // ===================================
    // Update Salary
    // ===================================

    if (salary !== undefined) {
      const numericSalary = Number(salary);

      if (Number.isNaN(numericSalary) || numericSalary < 0) {
        return res.status(400).json({
          success: false,
          message: "Please enter a valid salary",
        });
      }

      job.salary = numericSalary;
    }

    // ===================================
    // Update Description
    // ===================================

    if (description !== undefined) {
      if (!String(description).trim()) {
        return res.status(400).json({
          success: false,
          message: "Description cannot be empty",
        });
      }

      job.description = String(description).trim();
    }

    // ===================================
    // Update Deadline
    // ===================================

    if (deadline !== undefined) {
      const deadlineDate = new Date(deadline);

      if (Number.isNaN(deadlineDate.getTime())) {
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

      job.deadline = deadlineDate;
    }

    // ===================================
    // Update Skills
    // ===================================

    if (skills !== undefined) {
      let processedSkills = skills;

      if (typeof processedSkills === "string") {
        processedSkills = processedSkills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean);
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

      job.skills = [
        ...new Set(
          processedSkills
            .map((skill) => String(skill).trim())
            .filter(Boolean)
        ),
      ];
    }

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });
  } catch (error) {
    console.error("Update Job Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to update job",
    });
  }
};

// ===================================
// Delete Job - Company
// ===================================

export const deleteJob = async (req, res) => {
  try {
    if (!req.company?._id) {
      return res.status(401).json({
        success: false,
        message: "Company authentication required",
      });
    }

    const job = await Job.findOne({
      _id: req.params.id,
      company: req.company._id,
    });

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found or you are not authorized",
      });
    }

    // Delete applications belonging to this job
    await Application.deleteMany({
      job: job._id,
    });

    await job.deleteOne();

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("Delete Job Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid job ID",
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || "Unable to delete job",
    });
  }
};

// ===================================
// Recommended Jobs
// ===================================

export const getRecommendedJobs = async (req, res) => {
  try {
    const student = await Student.findById(
      req.student._id
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // IMPORTANT:
    // Use extracted PDF text, not resume file path.
    if (
      !student.resume ||
      !student.resumeText ||
      !student.resumeText.trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload and analyze your resume first",
      });
    }

    const resumeText = student.resumeText.toLowerCase();

    // Only active jobs
    const jobs = await Job.find({
      deadline: { $gte: new Date() },
    })
      .populate(
        "company",
        "companyName name location website"
      )
      .sort({ createdAt: -1 });

    // ===================================
    // Calculate Match Percentage
    // ===================================

    const recommendedJobs = jobs
      .map((job) => {
        const jobSkills = Array.isArray(job.skills)
          ? job.skills
          : [];

        const matchedSkills = jobSkills.filter((skill) =>
          resumeText.includes(
            String(skill).toLowerCase()
          )
        );

        const matchPercentage =
          jobSkills.length > 0
            ? Math.round(
                (matchedSkills.length /
                  jobSkills.length) *
                  100
              )
            : 0;

        return {
          ...job.toObject(),
          matchedSkills,
          matchPercentage,
        };
      })
      .filter((job) => job.matchPercentage > 0)
      .sort(
        (a, b) =>
          b.matchPercentage - a.matchPercentage
      );

    return res.status(200).json({
      success: true,
      count: recommendedJobs.length,
      jobs: recommendedJobs,
    });
  } catch (error) {
    console.error("Recommended Jobs Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to generate job recommendations",
    });
  }
};