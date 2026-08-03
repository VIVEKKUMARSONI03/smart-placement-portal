import Job from "../models/Job.js";
import Student from "../models/Student.js";

// =======================================
// AI Job Recommendation
// =======================================

export const recommendJobs = async (req, res) => {
  try {

    // Logged in student
    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Resume text
    const resumeText = (student.resumeText || "").toLowerCase();

    if (!resumeText) {
      return res.status(400).json({
        success: false,
        message: "Please upload your resume first.",
      });
    }

    // All Jobs
    const jobs = await Job.find().populate(
      "company",
      "companyName name"
    );

    const recommendations = jobs
      .map((job) => {

        const jobSkills = job.skills || [];

        const matchedSkills = jobSkills.filter((skill) =>
          resumeText.includes(skill.toLowerCase())
        );

        const missingSkills = jobSkills.filter(
          (skill) =>
            !resumeText.includes(skill.toLowerCase())
        );

        const matchPercentage =
          jobSkills.length === 0
            ? 0
            : Math.round(
                (matchedSkills.length / jobSkills.length) * 100
              );

        return {
          _id: job._id,
          title: job.title,
          company:
            job.company?.companyName ||
            job.company?.name ||
            "Company",
          location: job.location,
          salary: job.salary,
          description: job.description,
          skills: jobSkills,
          matchedSkills,
          missingSkills,
          matchPercentage,
        };

      })
      .sort((a, b) => b.matchPercentage - a.matchPercentage);

    return res.status(200).json({
      success: true,
      recommendations,
    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};