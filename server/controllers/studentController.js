import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import Student from "../models/Student.js";

// =====================================
// Register Student
// =====================================

export const registerStudent = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const studentExists = await Student.findOne({ email });

    if (studentExists) {
      return res.status(400).json({
        success: false,
        message: "Student already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({
      name,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      success: true,
      message: "Student registered successfully",
      student,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// =====================================
// Login Student
// =====================================

export const loginStudent = async (req, res) => {
  console.log("Login request received", {
    path: req.path,
    email: req.body?.email,
  });

  try {
    const { email, password } = req.body;

    const student = await Student.findOne({ email }).select("+password");

    if (!student) {
      return res.status(400).json({
        success: false,
        message: "Student not found",
      });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET missing during login");
      return res.status(500).json({
        success: false,
        message: "Server configuration error: JWT_SECRET not set",
      });
    }

    const token = jwt.sign(
      { id: student._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    const studentData = student.toObject();
    delete studentData.password;

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      student: studentData,
    });
  } catch (error) {
    console.error("LoginStudent error:", error);
    res.status(500).json({
      success: false,
      message: error?.message || "Login failed due to server error",
    });
  }
};

// =====================================
// Get Profile
// =====================================

export const getProfile = async (req, res) => {

  try {

    const student = await Student.findById(req.student.id).select("-password");

    if (!student) {

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });

    }

    res.status(200).json({
      success: true,
      student,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// =====================================
// Update Profile
// =====================================

export const updateProfile = async (req, res) => {

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
      profileImage,
      bio,
    } = req.body;

    const student = await Student.findById(req.student.id);

    if (!student) {

      return res.status(404).json({
        success: false,
        message: "Student not found",
      });

    }

    student.name = name || student.name;
    student.phone = phone || "";
    student.college = college || "";
    student.branch = branch || "";
    student.cgpa = cgpa || 0;

    student.skills = Array.isArray(skills)
      ? skills
      : typeof skills === "string"
      ? skills.split(",").map((s) => s.trim())
      : [];

    student.github = github || "";
    student.linkedin = linkedin || "";
    student.profileImage = profileImage || "";
    student.bio = bio || "";

    await student.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      student,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};

// =====================================
// Update Resume Information
// =====================================

export const updateResume = async (req, res) => {

  try {

    const {
      resume,
      resumePublicId,
      resumeText,
      resumeScore,
    } = req.body;

    const student = await Student.findByIdAndUpdate(
      req.student.id,
      {
        resume,
        resumePublicId,
        resumeText,
        resumeScore,
      },
      {
        new: true,
      }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Resume updated successfully",
      student,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};