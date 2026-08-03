import fs from "fs";
import Student from "../models/Student.js";
import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";

// ===================================
// Read PDF Text
// ===================================

const extractPdfText = async (filePath) => {

  const data = new Uint8Array(fs.readFileSync(filePath));

  const pdf = await getDocument({ data }).promise;

  let text = "";

  for (let page = 1; page <= pdf.numPages; page++) {

    const currentPage = await pdf.getPage(page);

    const content = await currentPage.getTextContent();

    const strings = content.items.map((item) => item.str);

    text += strings.join(" ");

  }

  return text;

};

// ===================================
// Upload Resume + AI Analyze
// ===================================

export const uploadResume = async (req, res) => {

  try {

    if (!req.file) {

      return res.status(400).json({
        success: false,
        message: "Please upload PDF Resume",
      });

    }

    const student = await Student.findById(req.student._id);

    if (!student) {

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });

    }

    const rawText = await extractPdfText(req.file.path);

    const resumeText = rawText.toLowerCase();

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

    const matchedSkills = requiredSkills.filter((skill) =>
      resumeText.includes(skill)
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

    const recommendedCourses = missingSkills.map((skill) => ({
      skill,
      course: learningResources[skill]?.course || "Learn Online",
      link: learningResources[skill]?.link || "",
    }));

    // ===================================
    // Save in Database
    // ===================================

    student.resume = `/uploads/resumes/${req.file.filename}`;
    student.resumeText = resumeText;
    student.resumeScore = score;

    await student.save();

    return res.status(200).json({

      success: true,

      message: "Resume uploaded successfully",

      resume: student.resume,

      score,

      currentScore: score,

      potentialScore: 100,

      matchedSkills,

      missingSkills,

      recommendation,

      recommendedCourses,

      resumeText,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ===================================
// Get Resume
// ===================================

export const getResume = async (req, res) => {

  try {

    const student = await Student.findById(req.student._id);

    if (!student) {

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });

    }

    return res.status(200).json({

      success: true,

      resume: student.resume,

      resumeScore: student.resumeScore,

      resumeText: student.resumeText,

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};