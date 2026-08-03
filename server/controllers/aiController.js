import Job from "../models/Job.js";

// ==========================
// AI Resume Analyzer
// ==========================

export const analyzeResume = async (req, res) => {
  try {
    const { resumeText = "", skills = [] } = req.body;

    let text = "";

    if (Array.isArray(skills) && skills.length > 0) {
      text = skills.join(", ");
    } else if (Array.isArray(resumeText)) {
      text = resumeText.join(", ");
    } else {
      text = String(resumeText || "");
    }

    const requiredSkills = [
      "React",
      "Node",
      "Express",
      "MongoDB",
      "JavaScript",
      "HTML",
      "CSS",
      "Git",
      "SQL",
      "Docker",
    ];

    const learningResources = {
      React: {
        course: "React Official Documentation",
        link: "https://react.dev",
      },
      Node: {
        course: "Node.js Official Guide",
        link: "https://nodejs.org/en/docs",
      },
      Express: {
        course: "Express Documentation",
        link: "https://expressjs.com",
      },
      MongoDB: {
        course: "MongoDB University",
        link: "https://learn.mongodb.com",
      },
      JavaScript: {
        course: "JavaScript.info",
        link: "https://javascript.info",
      },
      HTML: {
        course: "MDN HTML Guide",
        link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
      },
      CSS: {
        course: "MDN CSS Guide",
        link: "https://developer.mozilla.org/en-US/docs/Web/CSS",
      },
      Git: {
        course: "Git SCM",
        link: "https://git-scm.com/docs",
      },
      SQL: {
        course: "SQLBolt",
        link: "https://sqlbolt.com",
      },
      Docker: {
        course: "Docker Getting Started",
        link: "https://docs.docker.com/get-started",
      },
    };

    const resume = text.toLowerCase();

    const matchedSkills = requiredSkills.filter((skill) =>
      resume.includes(skill.toLowerCase())
    );

    const missingSkills = requiredSkills.filter(
      (skill) => !matchedSkills.includes(skill)
    );

    const score = Math.round(
      (matchedSkills.length / requiredSkills.length) * 100
    );

    let recommendation = "";

    if (score >= 80) {
      recommendation = "Excellent Resume";
    } else if (score >= 60) {
      recommendation = "Good Resume. Improve missing skills.";
    } else {
      recommendation = "Needs Improvement. Learn the missing skills.";
    }

    const recommendedCourses = missingSkills.map((skill) => ({
      skill,
      course: learningResources[skill].course,
      link: learningResources[skill].link,
    }));

    res.json({
      success: true,

      score,

      matchedSkills,

      missingSkills,

      recommendation,

      recommendedCourses,

      currentScore: score,

      potentialScore: 100,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// AI Job Recommendation
// ==========================

export const recommendJobs = async (req, res) => {

  try {

    const skills = req.query.skills
      ? req.query.skills
          .split(",")
          .map((s) => s.trim().toLowerCase())
      : [];

    const jobs = await Job.find().populate("company", "name");

    const recommendations = jobs.map((job) => {

      const matchedSkills = job.skills.filter((skill) =>
        skills.includes(skill.toLowerCase())
      );

      const matchPercentage =
        job.skills.length === 0
          ? 0
          : Math.round(
              (matchedSkills.length / job.skills.length) * 100
            );

      return {
        _id: job._id,
        title: job.title,
        company: job.company?.name || "Company",
        location: job.location,
        salary: job.salary,
        skills: job.skills,
        matchedSkills,
        matchPercentage,
      };

    });

    recommendations.sort(
      (a, b) => b.matchPercentage - a.matchPercentage
    );

    res.json({
      success: true,
      recommendations,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};