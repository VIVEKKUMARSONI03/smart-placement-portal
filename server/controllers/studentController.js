import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs";
import path from "path";

import Student from "../models/Student.js";

import cloudinary from "../config/cloudinary.js";

// =====================================
// Generate Token
// =====================================

const generateToken = (studentId) => {
  return jwt.sign(
    {
      id: studentId,
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

// =====================================
// Delete Local Profile Image
// Backward Compatibility
// =====================================

const deleteLocalProfileImage = (
  imagePath
) => {
  try {
    if (
      !imagePath ||
      !imagePath.startsWith(
        "/uploads/profile-images/"
      )
    ) {
      return;
    }

    const fullPath = path.join(
      process.cwd(),
      imagePath.replace(/^\/+/, "")
    );

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }
  } catch (error) {
    console.error(
      "Local Profile Image Delete Error:",
      error
    );
  }
};

// =====================================
// Delete Cloudinary Image
// =====================================

const deleteCloudinaryImage =
  async (publicId) => {
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
        "Cloudinary Image Delete Error:",
        error
      );
    }
  };

// =====================================
// Register Student
// =====================================

export const registerStudent = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
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

    const existingStudent =
      await Student.findOne({
        email: normalizedEmail,
      });

    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message:
          "Student already registered with this email",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const student =
      await Student.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
      });

    const token =
      generateToken(
        student._id
      );

    return res.status(201).json({
      success: true,
      message:
        "Student registered successfully",
      token,

      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        profileImage:
          student.profileImage,
      },
    });
  } catch (error) {
    console.error(
      "Register Student Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to register student",
    });
  }
};

// =====================================
// Login Student
// =====================================

export const loginStudent = async (
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

    const student =
      await Student.findOne({
        email:
          email
            .toLowerCase()
            .trim(),
      }).select("+password");

    if (!student) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        student.password
      );

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message:
          "Invalid email or password",
      });
    }

    const token =
      generateToken(
        student._id
      );

    return res.status(200).json({
      success: true,
      message:
        "Student login successful",
      token,

      student: {
        _id: student._id,
        name: student.name,
        email: student.email,
        profileImage:
          student.profileImage,
      },
    });
  } catch (error) {
    console.error(
      "Student Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to login student",
    });
  }
};

// =====================================
// Get Profile
// =====================================

export const getProfile = async (
  req,
  res
) => {
  try {
    const student =
      await Student.findById(
        req.student._id
      ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    console.error(
      "Get Student Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to load student profile",
    });
  }
};

// =====================================
// Update Profile
// =====================================

export const updateProfile = async (
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

    const {
      name,
      phone,
      college,
      branch,
      cgpa,
      skills,
      github,
      linkedin,
      bio,
    } = req.body;

    if (
      name !== undefined &&
      !String(name).trim()
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Name cannot be empty",
      });
    }

    if (name !== undefined) {
      student.name =
        String(name).trim();
    }

    if (phone !== undefined) {
      student.phone =
        String(phone).trim();
    }

    if (college !== undefined) {
      student.college =
        String(college).trim();
    }

    if (branch !== undefined) {
      student.branch =
        String(branch).trim();
    }

    if (
      cgpa !== undefined &&
      cgpa !== ""
    ) {
      const cgpaNumber =
        Number(cgpa);

      if (
        Number.isNaN(
          cgpaNumber
        ) ||
        cgpaNumber < 0 ||
        cgpaNumber > 10
      ) {
        return res.status(400).json({
          success: false,
          message:
            "CGPA must be between 0 and 10",
        });
      }

      student.cgpa =
        cgpaNumber;
    }

    if (skills !== undefined) {
      if (Array.isArray(skills)) {
        student.skills =
          skills
            .map((skill) =>
              String(skill).trim()
            )
            .filter(Boolean);
      } else {
        student.skills =
          String(skills)
            .split(",")
            .map((skill) =>
              skill.trim()
            )
            .filter(Boolean);
      }
    }

    if (github !== undefined) {
      student.github =
        String(github).trim();
    }

    if (linkedin !== undefined) {
      student.linkedin =
        String(linkedin).trim();
    }

    if (bio !== undefined) {
      student.bio =
        String(bio).trim();
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      student,
    });
  } catch (error) {
    console.error(
      "Update Student Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update profile",
    });
  }
};

// =====================================
// Update Resume Information
// =====================================

export const updateResume = async (
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

    const {
      resume,
      resumePublicId,
      resumeText,
      resumeScore,
    } = req.body;

    if (resume !== undefined) {
      student.resume = resume;
    }

    if (
      resumePublicId !== undefined
    ) {
      student.resumePublicId =
        resumePublicId;
    }

    if (
      resumeText !== undefined
    ) {
      student.resumeText =
        resumeText;
    }

    if (
      resumeScore !== undefined
    ) {
      student.resumeScore =
        Number(resumeScore) || 0;
    }

    await student.save();

    return res.status(200).json({
      success: true,
      message:
        "Resume information updated successfully",
      student,
    });
  } catch (error) {
    console.error(
      "Update Resume Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Unable to update resume",
    });
  }
};

// =====================================
// Upload Profile Image
// =====================================

export const uploadProfileImage =
  async (req, res) => {
    let newPublicId = "";

    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a profile image",
        });
      }

      const student =
        await Student.findById(
          req.student._id
        );

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      const oldImage =
        student.profileImage;

      const oldPublicId =
        student.profileImagePublicId;

      // =====================================
      // Upload To Cloudinary
      // =====================================

      const uploadResult =
        await uploadBufferToCloudinary(
          req.file.buffer,
          {
            resource_type: "image",

            folder:
              "smart-placement-portal/profile-images",

            public_id:
              `student-${student._id}-${Date.now()}`,
          }
        );

      newPublicId =
        uploadResult.public_id;

      student.profileImage =
        uploadResult.secure_url;

      student.profileImagePublicId =
        uploadResult.public_id;

      await student.save();

      // =====================================
      // Delete Old Image
      // =====================================

      if (oldPublicId) {
        await deleteCloudinaryImage(
          oldPublicId
        );
      } else {
        deleteLocalProfileImage(
          oldImage
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "Profile image updated successfully",
        profileImage:
          student.profileImage,
      });
    } catch (error) {
      console.error(
        "Upload Profile Image Error:",
        error
      );

      if (newPublicId) {
        await deleteCloudinaryImage(
          newPublicId
        );
      }

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to upload profile image",
      });
    }
  };

// =====================================
// Remove Profile Image
// =====================================

export const removeProfileImage =
  async (req, res) => {
    try {
      const student =
        await Student.findById(
          req.student._id
        );

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      if (!student.profileImage) {
        return res.status(400).json({
          success: false,
          message:
            "Profile image is not uploaded",
        });
      }

      const oldImage =
        student.profileImage;

      const oldPublicId =
        student.profileImagePublicId;

      student.profileImage = "";
      student.profileImagePublicId =
        "";

      await student.save();

      if (oldPublicId) {
        await deleteCloudinaryImage(
          oldPublicId
        );
      } else {
        deleteLocalProfileImage(
          oldImage
        );
      }

      return res.status(200).json({
        success: true,
        message:
          "Profile image removed successfully",
      });
    } catch (error) {
      console.error(
        "Remove Profile Image Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to remove profile image",
      });
    }
  };

// =====================================
// Change Password
// =====================================

export const changePassword =
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

      const student =
        await Student.findById(
          req.student._id
        ).select("+password");

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "Student not found",
        });
      }

      const passwordMatch =
        await bcrypt.compare(
          currentPassword,
          student.password
        );

      if (!passwordMatch) {
        return res.status(400).json({
          success: false,
          message:
            "Current password is incorrect",
        });
      }

      student.password =
        await bcrypt.hash(
          newPassword,
          10
        );

      await student.save();

      return res.status(200).json({
        success: true,
        message:
          "Password changed successfully",
      });
    } catch (error) {
      console.error(
        "Change Password Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          "Unable to change password",
      });
    }
  };