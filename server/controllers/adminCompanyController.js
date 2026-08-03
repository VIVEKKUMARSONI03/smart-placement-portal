import Company from "../models/Company.js";

// ==========================
// Get All Companies
// ==========================

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

// ==========================
// Delete Company
// ==========================

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