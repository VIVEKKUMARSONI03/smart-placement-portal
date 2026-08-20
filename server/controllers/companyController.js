import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import Company from "../models/Company.js";
import Application from "../models/Application.js";

// =====================================
// Generate JWT Token
// =====================================

const generateToken = (companyId) => {
  return jwt.sign(
    { id: companyId },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =====================================
// Register Company
// =====================================

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

    // =====================================
    // Required Fields
    // =====================================

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    // =====================================
    // Password Validation
    // =====================================

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    // =====================================
    // Check Existing Company
    // =====================================

    const existingCompany =
      await Company.findOne({
        email: email.toLowerCase().trim(),
      });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message:
          "Company already registered with this email",
      });
    }

    // =====================================
    // Hash Password
    // =====================================

    const hashedPassword =
      await bcrypt.hash(password, 10);

    // =====================================
    // Create Company
    // =====================================

    const company = await Company.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      website: website?.trim() || "",
      location: location?.trim() || "",
      description:
        description?.trim() || "",
    });

    // =====================================
    // Token
    // =====================================

    const token = generateToken(company._id);

    return res.status(201).json({
      success: true,
      message:
        "Company registered successfully",
      token,

      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        website: company.website,
        location: company.location,
        description: company.description,
        logo: company.logo || "",
      },
    });
  } catch (error) {
    console.error(
      "Register Company Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// Login Company
// =====================================

export const loginCompany = async (
  req,
  res
) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    // password select:false hone par
    // explicitly password select karenge

    const company = await Company.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password");

    if (!company) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // =====================================
    // Compare Password
    // =====================================

    const passwordMatch =
      await bcrypt.compare(
        password,
        company.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // =====================================
    // Generate Token
    // =====================================

    const token = generateToken(company._id);

    return res.status(200).json({
      success: true,
      message: "Company login successful",
      token,

      company: {
        _id: company._id,
        name: company.name,
        email: company.email,
        website: company.website,
        location: company.location,
        description: company.description,
        logo: company.logo || "",
      },
    });
  } catch (error) {
    console.error(
      "Company Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// =====================================
// Get Company Profile
// =====================================

export const getCompanyProfile = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findById(
        req.company._id
      ).select("-password");

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    return res.status(200).json({
      success: true,
      company,
    });
  } catch (error) {
    console.error(
      "Get Company Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load company profile",
    });
  }
};

// =====================================
// Update Company Profile
// =====================================

export const updateCompanyProfile =
  async (req, res) => {
    try {
      const {
        name,
        website,
        location,
        description,
      } = req.body;

      const company =
        await Company.findById(
          req.company._id
        );

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      if (
        name !== undefined &&
        !name.trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Company name cannot be empty",
        });
      }

      if (name !== undefined) {
        company.name = name.trim();
      }

      if (website !== undefined) {
        company.website =
          website.trim();
      }

      if (location !== undefined) {
        company.location =
          location.trim();
      }

      if (description !== undefined) {
        company.description =
          description.trim();
      }

      await company.save();

      return res.status(200).json({
        success: true,
        message:
          "Company profile updated successfully",

        company: {
          _id: company._id,
          name: company.name,
          email: company.email,
          website: company.website,
          location: company.location,
          description:
            company.description,
          logo: company.logo || "",
        },
      });
    } catch (error) {
      console.error(
        "Update Company Profile Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to update company profile",
      });
    }
  };

// =====================================
// Upload Company Logo
// =====================================

export const uploadCompanyLogo = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message:
          "Please select a company logo",
      });
    }

    const company =
      await Company.findById(
        req.company._id
      );

    if (!company) {
      if (
        req.file?.path &&
        fs.existsSync(req.file.path)
      ) {
        fs.unlinkSync(req.file.path);
      }

      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    // =====================================
    // Delete Previous Local Logo
    // =====================================

    if (
      company.logo &&
      company.logo.startsWith(
        "/uploads/company-logos/"
      )
    ) {
      const oldLogoPath = path.join(
        process.cwd(),
        company.logo.replace(
          /^\/+/,
          ""
        )
      );

      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    // =====================================
    // Save New Logo
    // =====================================

    const logoPath =
      `/uploads/company-logos/${req.file.filename}`;

    company.logo = logoPath;

    await company.save();

    return res.status(200).json({
      success: true,
      message:
        "Company logo updated successfully",
      logo: company.logo,
    });
  } catch (error) {
    console.error(
      "Upload Company Logo Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to upload company logo",
    });
  }
};

// =====================================
// Remove Company Logo
// =====================================

export const removeCompanyLogo = async (
  req,
  res
) => {
  try {
    const company =
      await Company.findById(
        req.company._id
      );

    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    if (!company.logo) {
      return res.status(400).json({
        success: false,
        message:
          "Company logo is not uploaded",
      });
    }

    // =====================================
    // Delete Local Logo File
    // =====================================

    if (
      company.logo.startsWith(
        "/uploads/company-logos/"
      )
    ) {
      const logoPath = path.join(
        process.cwd(),
        company.logo.replace(
          /^\/+/,
          ""
        )
      );

      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    company.logo = "";

    await company.save();

    return res.status(200).json({
      success: true,
      message:
        "Company logo removed successfully",
    });
  } catch (error) {
    console.error(
      "Remove Company Logo Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to remove company logo",
    });
  }
};

// =====================================
// Change Company Password
// =====================================

export const changeCompanyPassword =
  async (req, res) => {
    try {
      const {
        currentPassword,
        newPassword,
      } = req.body;

      // =====================================
      // Required Fields
      // =====================================

      if (
        !currentPassword ||
        !newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Current password and new password are required",
        });
      }

      // =====================================
      // New Password Validation
      // =====================================

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be at least 6 characters",
        });
      }

      if (
        currentPassword === newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be different from current password",
        });
      }

      // =====================================
      // Get Company With Password
      // =====================================

      const company =
        await Company.findById(
          req.company._id
        ).select("+password");

      if (!company) {
        return res.status(404).json({
          success: false,
          message: "Company not found",
        });
      }

      // =====================================
      // Verify Current Password
      // =====================================

      const passwordMatch =
        await bcrypt.compare(
          currentPassword,
          company.password
        );

      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      // =====================================
      // Hash New Password
      // =====================================

      const hashedPassword =
        await bcrypt.hash(
          newPassword,
          10
        );

      company.password =
        hashedPassword;

      await company.save();

      return res.status(200).json({
        success: true,
        message:
          "Password changed successfully",
      });
    } catch (error) {
      console.error(
        "Change Company Password Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to change password",
      });
    }
  };

// =====================================
// Get All Companies
// =====================================

export const getCompanies = async (
  req,
  res
) => {
  try {
    const companies =
      await Company.find()
        .select("-password")
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: companies.length,
      companies,
    });
  } catch (error) {
    console.error(
      "Get Companies Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load companies",
    });
  }
};

// =====================================
// Get Company Applicants
// =====================================

export const getApplicants = async (
  req,
  res
) => {
  try {
    const applications =
      await Application.find({
        company: req.company._id,
      })
        .populate(
          "student",
          "name email phone college branch cgpa skills resume resumeScore"
        )
        .populate(
          "job",
          "title location type salary"
        )
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error) {
    console.error(
      "Get Applicants Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load applicants",
    });
  }
};