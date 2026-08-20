import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import fs from "fs";
import path from "path";

import Student from "../models/Student.js";

// =====================================
// Register Student
// =====================================

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

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
      email.trim().toLowerCase();

    const studentExists =
      await Student.findOne({
        email: normalizedEmail,
      });

    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const student = await Student.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
    });

    const studentData = student.toObject();

    delete studentData.password;

    return res.status(201).json({
      success: true,
      message:
        "Student registered successfully",
      student: studentData,
    });
  } catch (error) {
    console.error(
      "Register Student Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Login Student
// =====================================

export const loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Email and password are required",
      });
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const student = await Student.findOne({
      email: normalizedEmail,
    }).select("+password");

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      student.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message:
          "Server configuration error",
      });
    }

    const token = jwt.sign(
      {
        id: student._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const studentData =
      student.toObject();

    delete studentData.password;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: studentData,
    });
  } catch (error) {
    console.error(
      "Login Student Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message || "Login failed",
    });
  }
};

// =====================================
// Get Profile
// =====================================

export const getProfile = async (req, res) => {
  try {
    const studentId =
      req.student?._id ||
      req.student?.id;

    const student =
      await Student.findById(
        studentId
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
      "Get Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
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

    const studentId =
      req.student?._id ||
      req.student?.id;

    const student =
      await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!name || !String(name).trim()) {
      return res.status(400).json({
        success: false,
        message: "Name is required",
      });
    }

    // =====================================
    // CGPA
    // =====================================

    const parsedCgpa =
      cgpa === "" ||
      cgpa === null ||
      cgpa === undefined
        ? 0
        : Number(cgpa);

    if (
      Number.isNaN(parsedCgpa) ||
      parsedCgpa < 0 ||
      parsedCgpa > 10
    ) {
      return res.status(400).json({
        success: false,
        message:
          "CGPA must be between 0 and 10",
      });
    }

    // =====================================
    // Skills
    // =====================================

    let processedSkills = [];

    if (Array.isArray(skills)) {
      processedSkills = skills
        .map((skill) =>
          String(skill).trim()
        )
        .filter(Boolean);
    } else if (
      typeof skills === "string"
    ) {
      processedSkills = skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);
    }

    // Remove duplicates
    processedSkills =
      processedSkills.filter(
        (skill, index, array) =>
          index ===
          array.findIndex(
            (item) =>
              item.toLowerCase() ===
              skill.toLowerCase()
          )
      );

    // =====================================
    // Update Fields
    // =====================================

    student.name =
      String(name).trim();

    student.phone =
      typeof phone === "string"
        ? phone.trim()
        : "";

    student.college =
      typeof college === "string"
        ? college.trim()
        : "";

    student.branch =
      typeof branch === "string"
        ? branch.trim()
        : "";

    student.cgpa = parsedCgpa;

    student.skills =
      processedSkills;

    student.github =
      typeof github === "string"
        ? github.trim()
        : "";

    student.linkedin =
      typeof linkedin === "string"
        ? linkedin.trim()
        : "";

    student.bio =
      typeof bio === "string"
        ? bio.trim()
        : "";

    await student.save();

    const studentData =
      student.toObject();

    delete studentData.password;

    return res.status(200).json({
      success: true,
      message:
        "Profile updated successfully",
      student: studentData,
    });
  } catch (error) {
    console.error(
      "Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Upload Profile Image
// =====================================

export const uploadProfileImage =
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          message:
            "Please select a profile image",
        });
      }

      const studentId =
        req.student?._id ||
        req.student?.id;

      const student =
        await Student.findById(
          studentId
        );

      if (!student) {
        // Remove newly uploaded file
        if (
          req.file?.path &&
          fs.existsSync(req.file.path)
        ) {
          fs.unlinkSync(req.file.path);
        }

        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }



      // =====================================
      // Delete Old Local Profile Image
      // =====================================

      if (
        student.profileImage &&
        student.profileImage.startsWith(
          "/uploads/profile-images/"
        )
      ) {
        try {
          const oldImagePath =
            path.join(
              process.cwd(),
              student.profileImage.replace(
                /^\//,
                ""
              )
            );

          if (
            fs.existsSync(oldImagePath)
          ) {
            fs.unlinkSync(oldImagePath);
          }
        } catch (deleteError) {
          console.error(
            "Old Profile Image Delete Error:",
            deleteError
          );
        }
      }

      // =====================================
      // Save New Image URL
      // =====================================

      student.profileImage =
        `/uploads/profile-images/${req.file.filename}`;

      await student.save();

      return res.status(200).json({
        success: true,

        message:
          "Profile picture updated successfully",

        profileImage:
          student.profileImage,
      });
    } catch (error) {
      console.error(
        "Upload Profile Image Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to upload profile picture",
      });
    }
  };


  // =====================================
// Remove Profile Image
// =====================================

export const removeProfileImage = async (req, res) => {
  try {
    const studentId =
      req.student?._id ||
      req.student?.id;

    const student =
      await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // No image already
    if (!student.profileImage) {
      return res.status(400).json({
        success: false,
        message: "No profile picture to remove",
      });
    }

    // =====================================
    // Delete Local Image File
    // =====================================

    if (
      student.profileImage.startsWith(
        "/uploads/profile-images/"
      )
    ) {
      try {
        const imagePath = path.join(
          process.cwd(),
          student.profileImage.replace(
            /^\//,
            ""
          )
        );

        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      } catch (deleteError) {
        console.error(
          "Profile Image Delete Error:",
          deleteError
        );
      }
    }

    // =====================================
    // Remove From Database
    // =====================================

    student.profileImage = "";

    await student.save();

    return res.status(200).json({
      success: true,
      message:
        "Profile picture removed successfully",
      profileImage: "",
    });
  } catch (error) {
    console.error(
      "Remove Profile Image Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to remove profile picture",
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
    const {
      resume,
      resumePublicId,
      resumeText,
      resumeScore,
    } = req.body;

    const studentId =
      req.student?._id ||
      req.student?.id;

    const student =
      await Student.findByIdAndUpdate(
        studentId,
        {
          resume,
          resumePublicId,
          resumeText,
          resumeScore,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    return res.status(200).json({
      success: true,
      message:
        "Resume updated successfully",
      student,
    });
  } catch (error) {
    console.error(
      "Update Resume Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =====================================
// Change Password
// =====================================

export const changePassword = async (
  req,
  res
) => {
  try {
    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = req.body;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "All password fields are required",
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
      newPassword !==
      confirmPassword
    ) {
      return res.status(400).json({
        success: false,
        message:
          "New password and confirm password do not match",
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

    const studentId =
      req.student?._id ||
      req.student?.id;

    const student =
      await Student.findById(
        studentId
      ).select("+password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        student.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    student.password =
      hashedPassword;

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
      message: error.message,
    });
  }
};