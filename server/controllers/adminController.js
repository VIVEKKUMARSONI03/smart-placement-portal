import Admin from "../models/Admin.js";
import Student from "../models/Student.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ============================
// Admin Login
// ============================

export const loginAdmin = async (req, res) => {

  try {

    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {

      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });

    }

    const isMatch = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isMatch) {

      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });

    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      message: "Login Successful",
      token,
      admin,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// ============================
// Dashboard
// ============================

export const adminDashboard = async (req, res) => {

  try {

    const students = await Student.countDocuments();

    const companies = await Company.countDocuments();

    const jobs = await Job.countDocuments();

    const applications = await Application.countDocuments();

    res.json({

      success: true,

      dashboard: {

        students,
        companies,
        jobs,
        applications,

      },

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};
// ============================
// Register First Admin
// ============================

export const registerAdmin = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const exists = await Admin.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = await Admin.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Admin created successfully",
      admin,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ============================
// Get All Students
// ============================

export const getAllStudents = async (req, res) => {
  try {

    const students = await Student.find().select("-password");

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

// ============================
// Delete Student
// ============================

export const deleteStudent = async (req, res) => {
  try {

    const student = await Student.findById(req.params.id);

    if (!student) {

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });

    }

    await Student.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Student deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};
// ============================
// Get All Companies
// ============================

export const getAllCompanies = async (req, res) => {

  try {

    const companies = await Company.find().select("-password");

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

// ============================
// Delete Company
// ============================

export const deleteCompany = async (req, res) => {

  try {

    const company = await Company.findById(req.params.id);

    if (!company) {

      return res.status(404).json({
        success: false,
        message: "Company not found",
      });

    }

    await Company.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Company deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};