import Student from "../models/Student.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// =========================
// Search Students
// =========================
export const searchStudents = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const students = await Student.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Search Companies
// =========================
export const searchCompanies = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const companies = await Company.find({
      $or: [
        { name: { $regex: keyword, $options: "i" } },
        { email: { $regex: keyword, $options: "i" } },
        { location: { $regex: keyword, $options: "i" } },
      ],
    });

    res.json({
      success: true,
      companies,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Search Jobs
// =========================
export const searchJobs = async (req, res) => {
  try {
    const keyword = req.query.keyword || "";

    const jobs = await Job.find({
      title: {
        $regex: keyword,
        $options: "i",
      },
    }).populate("company", "name");

    res.json({
      success: true,
      jobs,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =========================
// Search Applications
// =========================
export const searchApplications = async (req, res) => {
  try {
    const status = req.query.status || "";

    const applications = await Application.find(
      status ? { status } : {}
    )
      .populate("student", "name email")
      .populate("company", "name")
      .populate("job", "title");

    res.json({
      success: true,
      applications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};