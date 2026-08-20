import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

// =====================================
// Get All Companies
// =====================================

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error("Get Companies Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to fetch companies",
    });
  }
};

// =====================================
// Delete Company
// =====================================

export const deleteCompany = async (req, res) => {
  try {
    // =================================
    // Find Company
    // =================================

    const company = await Company.findById(
      req.params.id
    );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // =================================
    // Delete Company Applications
    // =================================

    await Application.deleteMany({
      company: company._id,
    });

    // =================================
    // Delete Company Jobs
    // =================================

    await Job.deleteMany({
      company: company._id,
    });

    // =================================
    // Delete Company
    // =================================

    await company.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Company and related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete Company Error:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid company ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to delete company",
    });
  }
};