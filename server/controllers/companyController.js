import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import Company from "../models/Company.js";
import Application from "../models/Application.js";
import cloudinary from "../config/cloudinary.js";

// =====================================
// Generate JWT Token
// =====================================

const generateToken = (companyId) => {
  return jwt.sign(
    {
      id: companyId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
};

// =====================================
// Upload Buffer To Cloudinary
// =====================================

const uploadBufferToCloudinary = (
  buffer,
  options
) => {
  return new Promise((resolve, reject) => {
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
  });
};

// =====================================
// Delete Old Local Company Logo
// For old locally stored logos
// =====================================

const deleteLocalCompanyLogo = (
  logoPath
) => {
  try {
    if (
      !logoPath ||
      !logoPath.startsWith(
        "/uploads/company-logos/"
      )
    ) {
      return;
    }

    const fullPath = path.join(
      process.cwd(),
      logoPath.replace(/^\/+/, "")
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error(
      "Local Company Logo Delete Error:",
      error
    );
  }
};

// =====================================
// Delete Cloudinary Company Logo
// =====================================

const deleteCloudinaryLogo = async (
  publicId
) => {
  if (!publicId) {
    return;
  }

  try {
    await cloudinary.uploader.destroy(
      publicId,
      {
        resource_type: "image",
        invalidate: true,
      }
    );
  } catch (error) {
    console.error(
      "Cloudinary Logo Delete Error:",
      error
    );
  }
};

// =====================================
// Register Company
// =====================================

export const registerCompany = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      website,
      location,
      description,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message:
          "Password must be at least 6 characters",
      });
    }

    const normalizedEmail =
      email.toLowerCase().trim();

    const existingCompany =
      await Company.findOne({
        email: normalizedEmail,
      });

    if (existingCompany) {
      return res.status(400).json({
        success: false,
        message:
          "Company already registered with this email",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const company =
      await Company.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        website:
          website?.trim() || "",
        location:
          location?.trim() || "",
        description:
          description?.trim() || "",
      });

    const token = generateToken(
      company._id
    );

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
        description:
          company.description,
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
      message:
        "Unable to register company",
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
    const {
      email,
      password,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const company =
      await Company.findOne({
        email: email
          .toLowerCase()
          .trim(),
      }).select("+password");

    if (!company) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        company.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token = generateToken(
      company._id
    );

    return res.status(200).json({
      success: true,
      message:
        "Company login successful",
      token,

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
      "Company Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login company",
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
        message:
          "Company not found",
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
          message:
            "Company not found",
        });
      }

      if (
        name !== undefined &&
        !String(name).trim()
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Company name cannot be empty",
        });
      }

      if (name !== undefined) {
        company.name =
          String(name).trim();
      }

      if (website !== undefined) {
        company.website =
          String(website).trim();
      }

      if (location !== undefined) {
        company.location =
          String(location).trim();
      }

      if (
        description !== undefined
      ) {
        company.description =
          String(description).trim();
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
// Upload / Replace Company Logo
// =====================================

export const uploadCompanyLogo =
  async (req, res) => {
    let newPublicId = "";

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
        return res.status(404).json({
          success: false,
          message:
            "Company not found",
        });
      }

      // =====================================
      // Old Logo Data
      // =====================================

      const oldLogo =
        company.logo || "";

      const oldPublicId =
        company.logoPublicId || "";

      // =====================================
      // Upload New Logo To Cloudinary
      // =====================================

      const uploadResult =
        await uploadBufferToCloudinary(
          req.file.buffer,
          {
            resource_type: "image",

            folder:
              "smart-placement-portal/company-logos",

            public_id:
              `company-${company._id}-${Date.now()}`,

            overwrite: true,
          }
        );

      if (
        !uploadResult?.secure_url ||
        !uploadResult?.public_id
      ) {
        throw new Error(
          "Cloudinary logo upload failed"
        );
      }

      newPublicId =
        uploadResult.public_id;

      // =====================================
      // Save Cloudinary URL + Public ID
      // =====================================

      company.logo =
        uploadResult.secure_url;

      company.logoPublicId =
        uploadResult.public_id;

      await company.save();

      // =====================================
      // Delete Previous Logo
      // =====================================

      if (oldPublicId) {
        await deleteCloudinaryLogo(
          oldPublicId
        );
      } else if (oldLogo) {
        deleteLocalCompanyLogo(
          oldLogo
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "Company logo updated successfully",

        logo: company.logo,

        logoPublicId:
          company.logoPublicId,
      });
    } catch (error) {
      console.error(
        "Upload Company Logo Error:",
        error
      );

      // New upload hua but DB save fail hua
      if (newPublicId) {
        await deleteCloudinaryLogo(
          newPublicId
        );
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to upload company logo",
      });
    }
  };

// =====================================
// Remove Company Logo
// =====================================

export const removeCompanyLogo =
  async (req, res) => {
    try {
      const company =
        await Company.findById(
          req.company._id
        );

      if (!company) {
        return res.status(404).json({
          success: false,
          message:
            "Company not found",
        });
      }

      if (!company.logo) {
        return res.status(400).json({
          success: false,
          message:
            "Company logo is not uploaded",
        });
      }

      const oldLogo =
        company.logo;

      const oldPublicId =
        company.logoPublicId || "";

      // =====================================
      // Clear Database First
      // =====================================

      company.logo = "";
      company.logoPublicId = "";

      await company.save();

      // =====================================
      // Delete Actual File
      // =====================================

      if (oldPublicId) {
        await deleteCloudinaryLogo(
          oldPublicId
        );
      } else {
        deleteLocalCompanyLogo(
          oldLogo
        );
      }

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

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be at least 6 characters",
        });
      }

      if (
        currentPassword ===
        newPassword
      ) {
        return res.status(400).json({
          success: false,
          message:
            "New password must be different from current password",
        });
      }

      const company =
        await Company.findById(
          req.company._id
        ).select("+password");

      if (!company) {
        return res.status(404).json({
          success: false,
          message:
            "Company not found",
        });
      }

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

      company.password =
        await bcrypt.hash(
          newPassword,
          10
        );

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
          "name email phone college branch cgpa skills resume resumeScore profileImage"
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
      count:
        applications.length,
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