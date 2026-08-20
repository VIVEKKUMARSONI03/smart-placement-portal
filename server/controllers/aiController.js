// ==========================================
// AI Resume Analyzer
// ==========================================

export const analyzeResume = async (req, res) => {
  try {
    const {
      resumeText = "",
      skills = [],
    } = req.body;

    // ======================================
    // Prepare Resume Text
    // ======================================

    let text = "";

    if (Array.isArray(skills) && skills.length > 0) {
      text = skills.join(" ");
    } else if (Array.isArray(resumeText)) {
      text = resumeText.join(" ");
    } else {
      text = String(resumeText || "");
    }

    text = text.trim();

    // ======================================
    // Validation
    // ======================================

    if (!text) {
      return res.status(400).json({
        success: false,
        message:
          "Resume text or skills are required for analysis",
      });
    }

    // ======================================
    // Required Skills
    // ======================================

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

    // ======================================
    // Learning Resources
    // ======================================

    const learningResources = {
      React: {
        course: "React Official Documentation",
        link: "https://react.dev",
      },

      Node: {
        course: "Node.js Official Documentation",
        link: "https://nodejs.org/en/docs",
      },

      Express: {
        course: "Express.js Documentation",
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
        course: "MDN HTML",
        link:
          "https://developer.mozilla.org/en-US/docs/Web/HTML",
      },

      CSS: {
        course: "MDN CSS",
        link:
          "https://developer.mozilla.org/en-US/docs/Web/CSS",
      },

      Git: {
        course: "Git SCM Documentation",
        link: "https://git-scm.com/docs",
      },

      SQL: {
        course: "SQLBolt",
        link: "https://sqlbolt.com",
      },

      Docker: {
        course: "Docker Getting Started",
        link:
          "https://docs.docker.com/get-started",
      },
    };

    // ======================================
    // Normalize Resume
    // ======================================

    const normalizedResume = text.toLowerCase();

    // ======================================
    // Find Matched Skills
    // ======================================

    const matchedSkills = requiredSkills.filter(
      (skill) =>
        normalizedResume.includes(
          skill.toLowerCase()
        )
    );

    // ======================================
    // Find Missing Skills
    // ======================================

    const missingSkills = requiredSkills.filter(
      (skill) =>
        !matchedSkills.includes(skill)
    );

    // ======================================
    // Calculate Resume Score
    // ======================================

    const score = Math.round(
      (matchedSkills.length /
        requiredSkills.length) *
        100
    );

    // ======================================
    // Recommendation
    // ======================================

    let recommendation;

    if (score >= 80) {
      recommendation =
        "Excellent Resume";
    } else if (score >= 60) {
      recommendation =
        "Good Resume. Improve the missing skills to increase your score.";
    } else if (score >= 40) {
      recommendation =
        "Average Resume. Add more relevant technical skills.";
    } else {
      recommendation =
        "Resume needs improvement. Focus on learning the missing skills.";
    }

    // ======================================
    // Recommended Courses
    // ======================================

    const recommendedCourses =
      missingSkills.map((skill) => ({
        skill,

        course:
          learningResources[skill]?.course ||
          "Learn Online",

        link:
          learningResources[skill]?.link ||
          "",
      }));

    // ======================================
    // Response
    // ======================================

    return res.status(200).json({
      success: true,

      score,

      currentScore: score,

      potentialScore: 100,

      totalSkills:
        requiredSkills.length,

      matchedCount:
        matchedSkills.length,

      missingCount:
        missingSkills.length,

      matchedSkills,

      missingSkills,

      recommendation,

      recommendedCourses,
    });
  } catch (error) {
    console.error(
      "Resume Analyzer Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to analyze resume",
    });
  }
};