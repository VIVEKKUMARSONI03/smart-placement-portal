import fs from "fs";
import path from "path";
import Student from "../models/Student.js";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// ===================================
// Required Skills
// ===================================

const requiredSkills = [
  "react",
  "node",
  "express",
  "mongodb",
  "javascript",
  "html",
  "css",
  "git",
  "sql",
  "docker",
];

// ===================================
// Learning Resources
// ===================================

const learningResources = {
  react: {
    course: "React Official Documentation",
    link: "https://react.dev",
  },

  node: {
    course: "Node.js Official Documentation",
    link: "https://nodejs.org/en/docs",
  },

  express: {
    course: "Express.js Documentation",
    link: "https://expressjs.com",
  },

  mongodb: {
    course: "MongoDB University",
    link: "https://learn.mongodb.com",
  },

  javascript: {
    course: "JavaScript.info",
    link: "https://javascript.info",
  },

  html: {
    course: "MDN HTML",
    link: "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },

  css: {
    course: "MDN CSS",
    link: "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },

  git: {
    course: "Git SCM Documentation",
    link: "https://git-scm.com/docs",
  },

  sql: {
    course: "SQLBolt",
    link: "https://sqlbolt.com",
  },

  docker: {
    course: "Docker Getting Started",
    link: "https://docs.docker.com/get-started",
  },
};

// ===================================
// Read PDF Text
// ===================================

const extractPdfText = async (filePath) => {
  const data = new Uint8Array(
    fs.readFileSync(filePath)
  );

  const pdf = await getDocument({
    data,
  }).promise;

  let text = "";

  for (
    let page = 1;
    page <= pdf.numPages;
    page++
  ) {
    const currentPage =
      await pdf.getPage(page);

    const content =
      await currentPage.getTextContent();

    const strings = content.items.map(
      (item) => item.str
    );

    text += `${strings.join(" ")} `;
  }

  return text.trim();
};

// ===================================
// Analyze Resume Text
// ===================================

const analyzeResumeText = (text = "") => {
  const resumeText =
    text.toLowerCase();

  const matchedSkills =
    requiredSkills.filter((skill) =>
      resumeText.includes(skill)
    );

  const missingSkills =
    requiredSkills.filter(
      (skill) =>
        !matchedSkills.includes(skill)
    );

  const score = Math.round(
    (matchedSkills.length /
      requiredSkills.length) *
      100
  );

  let recommendation = "";

  if (score >= 80) {
    recommendation =
      "Excellent Resume";
  } else if (score >= 60) {
    recommendation =
      "Good Resume. Improve missing skills.";
  } else {
    recommendation =
      "Needs Improvement. Learn the missing skills.";
  }

  const recommendedCourses =
    missingSkills.map((skill) => ({
      skill,

      course:
        learningResources[skill]
          ?.course ||
        "Learn Online",

      link:
        learningResources[skill]
          ?.link || "",
    }));

  return {
    score,
    matchedSkills,
    missingSkills,
    recommendation,
    recommendedCourses,
  };
};

// ===================================
// Delete Local Resume File
// ===================================

const deleteLocalResumeFile = (
  resumePath
) => {
  try {
    if (
      !resumePath ||
      !resumePath.startsWith(
        "/uploads/resumes/"
      )
    ) {
      return;
    }

    const filePath = path.join(
      process.cwd(),
      resumePath.replace(/^\/+/, "")
    );

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error(
      "Delete Resume File Error:",
      error
    );
  }
};

// ===================================
// Upload / Replace Resume + Analyze
// ===================================

export const uploadResume = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please upload PDF Resume",
      });
    }

    const student =
      await Student.findById(
        req.student._id
      );

    if (!student) {
      if (
        req.file?.path &&
        fs.existsSync(req.file.path)
      ) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ===================================
    // Extract Resume Text
    // ===================================

    let rawText = "";

    try {
      rawText =
        await extractPdfText(
          req.file.path
        );
    } catch (error) {
      if (
        req.file?.path &&
        fs.existsSync(req.file.path)
      ) {
        fs.unlinkSync(req.file.path);
      }

      console.error(
        "PDF Text Extraction Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Unable to read this PDF. Please upload a valid text-based PDF resume.",
      });
    }

    if (!rawText.trim()) {
      if (
        req.file?.path &&
        fs.existsSync(req.file.path)
      ) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(400).json({
        success: false,
        message:
          "No readable text found in the PDF resume.",
      });
    }

    // ===================================
    // Analyze Resume
    // ===================================

    const resumeText =
      rawText.toLowerCase();

    const analysis =
      analyzeResumeText(
        resumeText
      );

    // ===================================
    // Keep Old Resume Path
    // ===================================

    const oldResume =
      student.resume;

    // ===================================
    // Save New Resume
    // ===================================

    const newResumePath =
      `/uploads/resumes/${req.file.filename}`;

    student.resume =
      newResumePath;

    student.resumeText =
      resumeText;

    student.resumeScore =
      analysis.score;

    student.resumePublicId = "";

    await student.save();

    // ===================================
    // Delete Old Resume After New Save
    // ===================================

    if (
      oldResume &&
      oldResume !== newResumePath
    ) {
      deleteLocalResumeFile(
        oldResume
      );
    }

    return res.status(200).json({
      success: true,

      message: oldResume
        ? "Resume replaced and analyzed successfully"
        : "Resume uploaded and analyzed successfully",

      resume: student.resume,

      score: analysis.score,

      currentScore:
        analysis.score,

      potentialScore: 100,

      matchedSkills:
        analysis.matchedSkills,

      missingSkills:
        analysis.missingSkills,

      recommendation:
        analysis.recommendation,

      recommendedCourses:
        analysis.recommendedCourses,
    });
  } catch (error) {
    console.error(
      "Upload Resume Error:",
      error
    );

    // Delete newly uploaded file if
    // an unexpected error happens
    if (
      req.file?.path &&
      fs.existsSync(req.file.path)
    ) {
      try {
        fs.unlinkSync(req.file.path);
      } catch (fileError) {
        console.error(
          "Resume Cleanup Error:",
          fileError
        );
      }
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to upload resume",
    });
  }
};

// ===================================
// Get Current Resume
// ===================================

export const getResume = async (
  req,
  res
) => {
  try {
    const student =
      await Student.findById(
        req.student._id
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // No Resume Uploaded
    if (!student.resume) {
      return res.status(200).json({
        success: true,
        hasResume: false,
        resume: "",
        resumeScore: 0,
      });
    }

    const analysis =
      analyzeResumeText(
        student.resumeText || ""
      );

    return res.status(200).json({
      success: true,

      hasResume: true,

      resume: student.resume,

      resumeScore:
        student.resumeScore || 0,

      score:
        student.resumeScore || 0,

      matchedSkills:
        analysis.matchedSkills,

      missingSkills:
        analysis.missingSkills,

      recommendation:
        analysis.recommendation,

      recommendedCourses:
        analysis.recommendedCourses,
    });
  } catch (error) {
    console.error(
      "Get Resume Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to load resume",
    });
  }
};

// ===================================
// Delete Resume
// ===================================

export const deleteResume = async (
  req,
  res
) => {
  try {
    const student =
      await Student.findById(
        req.student._id
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.resume) {
      return res.status(400).json({
        success: false,
        message:
          "No resume found to delete",
      });
    }

    const oldResume =
      student.resume;

    // ===================================
    // Clear Resume From Database
    // ===================================

    student.resume = "";
    student.resumeText = "";
    student.resumeScore = 0;
    student.resumePublicId = "";

    await student.save();

    // ===================================
    // Delete Resume File
    // ===================================

    deleteLocalResumeFile(
      oldResume
    );

    return res.status(200).json({
      success: true,
      message:
        "Resume deleted successfully",
    });
  } catch (error) {
    console.error(
      "Delete Resume Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete resume",
    });
  }
};