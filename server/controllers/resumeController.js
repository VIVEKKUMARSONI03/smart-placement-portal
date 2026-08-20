import fs from "fs";
import path from "path";

import Student from "../models/Student.js";

import cloudinary from "../config/cloudinary.js";

import {
  getDocument,
} from "pdfjs-dist/legacy/build/pdf.mjs";

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
    course:
      "React Official Documentation",
    link: "https://react.dev",
  },

  node: {
    course:
      "Node.js Official Documentation",
    link:
      "https://nodejs.org/en/docs",
  },

  express: {
    course:
      "Express.js Documentation",
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
    link:
      "https://developer.mozilla.org/en-US/docs/Web/HTML",
  },

  css: {
    course: "MDN CSS",
    link:
      "https://developer.mozilla.org/en-US/docs/Web/CSS",
  },

  git: {
    course:
      "Git SCM Documentation",
    link: "https://git-scm.com/docs",
  },

  sql: {
    course: "SQLBolt",
    link: "https://sqlbolt.com",
  },

  docker: {
    course:
      "Docker Getting Started",
    link:
      "https://docs.docker.com/get-started",
  },
};

// ===================================
// Upload Buffer To Cloudinary
// ===================================

const uploadBufferToCloudinary = (
  buffer,
  options
) => {
  return new Promise(
    (resolve, reject) => {
      const stream =
        cloudinary.uploader.upload_stream(
          options,
          (error, result) => {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          }
        );

      stream.end(buffer);
    }
  );
};

// ===================================
// Extract PDF Text From Buffer
// ===================================

const extractPdfText = async (
  buffer
) => {
  const data =
    new Uint8Array(buffer);

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

    const strings =
      content.items.map(
        (item) => item.str
      );

    text += `${strings.join(" ")} `;
  }

  return text.trim();
};

// ===================================
// Analyze Resume
// ===================================

const analyzeResumeText = (
  text = ""
) => {
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
// Delete Old Local Resume
// Backward Compatibility
// ===================================

const deleteLocalResume = (
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

    const fullPath = path.join(
      process.cwd(),
      resumePath.replace(/^\/+/, "")
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error(
      "Local Resume Delete Error:",
      error
    );
  }
};

// ===================================
// Delete Cloudinary Resume
// ===================================

const deleteCloudinaryResume =
  async (publicId) => {
    if (!publicId) {
      return;
    }

    try {
      await cloudinary.uploader.destroy(
        publicId,
        {
          resource_type: "raw",
          invalidate: true,
        }
      );
    } catch (error) {
      console.error(
        "Cloudinary Resume Delete Error:",
        error
      );
    }
  };

// ===================================
// Upload / Replace Resume
// ===================================

export const uploadResume = async (
  req,
  res
) => {
  let newCloudinaryPublicId = "";

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
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // ===================================
    // Extract PDF Text
    // ===================================

    let rawText = "";

    try {
      rawText =
        await extractPdfText(
          req.file.buffer
        );
    } catch (error) {
      console.error(
        "PDF Extraction Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          "Unable to read this PDF. Please upload a valid text-based PDF resume.",
      });
    }

    if (!rawText.trim()) {
      return res.status(400).json({
        success: false,
        message:
          "No readable text found in the PDF resume.",
      });
    }

    const resumeText =
      rawText.toLowerCase();

    const analysis =
      analyzeResumeText(
        resumeText
      );

    // ===================================
    // Save Old Resume Information
    // ===================================

    const oldResume =
      student.resume;

    const oldResumePublicId =
      student.resumePublicId;

    // ===================================
    // Upload New Resume To Cloudinary
    // ===================================

    const uploadResult =
      await uploadBufferToCloudinary(
        req.file.buffer,
        {
          resource_type: "raw",

          folder:
            "smart-placement-portal/resumes",

          public_id:
            `resume-${student._id}-${Date.now()}.pdf`,
        }
      );

    newCloudinaryPublicId =
      uploadResult.public_id;

    // ===================================
    // Save Cloudinary Data
    // ===================================

    student.resume =
      uploadResult.secure_url;

    student.resumePublicId =
      uploadResult.public_id;

    student.resumeText =
      resumeText;

    student.resumeScore =
      analysis.score;

    await student.save();

    // ===================================
    // Delete Previous Resume
    // ===================================

    if (oldResumePublicId) {
      await deleteCloudinaryResume(
        oldResumePublicId
      );
    } else {
      deleteLocalResume(
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

    // Database save fail hone par
    // newly uploaded Cloudinary file cleanup
    if (newCloudinaryPublicId) {
      await deleteCloudinaryResume(
        newCloudinaryPublicId
      );
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
// Get Resume
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

    const oldResumePublicId =
      student.resumePublicId;

    // ===================================
    // Clear Database
    // ===================================

    student.resume = "";
    student.resumePublicId = "";
    student.resumeText = "";
    student.resumeScore = 0;

    await student.save();

    // ===================================
    // Delete File
    // ===================================

    if (oldResumePublicId) {
      await deleteCloudinaryResume(
        oldResumePublicId
      );
    } else {
      deleteLocalResume(
        oldResume
      );
    }

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