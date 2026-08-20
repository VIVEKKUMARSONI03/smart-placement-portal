import Job from "../models/Job.js";
import Student from "../models/Student.js";

// =======================================
// AI Job Recommendation
// =======================================

export const recommendJobs = async (req, res) => {
  try {
    // ===================================
    // Check Logged In Student
    // ===================================

    const studentId =
      req.student?._id || req.student?.id;

    if (!studentId) {
      return res.status(401).json({
        success: false,
        message: "Student authentication required",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ===================================
    // Check Resume
    // ===================================

    const resumeText = (
      student.resumeText || ""
    )
      .toLowerCase()
      .trim();

    if (!student.resume || !resumeText) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload and analyze your resume first",
      });
    }

    // ===================================
    // Get Active Jobs Only
    // ===================================

    const jobs = await Job.find({
      deadline: {
        $gte: new Date(),
      },
    })
      .populate(
        "company",
        "companyName name location website"
      )
      .sort({
        createdAt: -1,
      });

    // ===================================
    // Calculate Job Match
    // ===================================

    const recommendations = jobs
      .map((job) => {
        const jobSkills = Array.isArray(job.skills)
          ? job.skills
              .map((skill) =>
                String(skill).trim()
              )
              .filter(Boolean)
          : [];

        // ===================================
        // Matched Skills
        // ===================================

        const matchedSkills =
          jobSkills.filter((skill) =>
            resumeText.includes(
              skill.toLowerCase()
            )
          );

        // ===================================
        // Missing Skills
        // ===================================

        const missingSkills =
          jobSkills.filter(
            (skill) =>
              !resumeText.includes(
                skill.toLowerCase()
              )
          );

        // ===================================
        // Match Percentage
        // ===================================

        const matchPercentage =
          jobSkills.length === 0
            ? 0
            : Math.round(
                (matchedSkills.length /
                  jobSkills.length) *
                  100
              );

        return {
          _id: job._id,

          title: job.title,

          company: job.company,

          location: job.location,

          salary: job.salary,

          description: job.description,

          skills: jobSkills,

          deadline: job.deadline,

          matchedSkills,

          missingSkills,

          matchPercentage,

          createdAt: job.createdAt,
        };
      })

      // ===================================
      // Only Relevant Jobs
      // ===================================

      .filter(
        (job) =>
          job.matchPercentage > 0
      )

      // ===================================
      // Best Match First
      // ===================================

      .sort(
        (a, b) =>
          b.matchPercentage -
          a.matchPercentage
      );

    // ===================================
    // Response
    // ===================================

    return res.status(200).json({
      success: true,

      count: recommendations.length,

      jobs: recommendations,
    });
  } catch (error) {
    console.error(
      "AI Job Recommendation Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to generate job recommendations",
    });
  }
};