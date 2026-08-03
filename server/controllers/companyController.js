import Company from "../models/Company.js";
import Application from "../models/Application.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ===================================
// Company Register
// ===================================

export const registerCompany = async (req, res) => {
  try {

    const {
      name,
      email,
      password,
      website,
      location,
      description,
    } = req.body;

    const exists = await Company.findOne({ email });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Company already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const company = await Company.create({
      name,
      email,
      password: hashedPassword,
      website,
      location,
      description,
    });

    const companyData = company.toObject();

    delete companyData.password;

    res.status(201).json({
      success: true,
      message: "Company Registered Successfully",
      company: companyData,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Company Login
// ===================================

export const loginCompany = async (req, res) => {
  try {

    const { email, password } = req.body;

    const company = await Company.findOne({ email }).select("+password");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      company.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Credentials",
      });
    }

    const token = jwt.sign(
      {
        id: company._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const companyData = company.toObject();

    delete companyData.password;

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      company: companyData,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Get All Companies
// ===================================

export const getCompanies = async (req, res) => {
  try {

    const companies = await Company.find().select("-password");

    res.status(200).json({
      success: true,
      companies,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ===================================
// Get Company Applicants
// ===================================

export const getApplicants = async (req, res) => {
  try {

    const applications = await Application.find({
      company: req.company._id,
    })
      .populate("student", "name email resume")
      .populate("job", "title");

    res.status(200).json({
      success: true,
      applications,
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};