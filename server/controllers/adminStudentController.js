import Student from "../models/Student.js";
import Application from "../models/Application.js";
import Notification from "../models/Notification.js";

// =====================================
// Get All Students
// =====================================

export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Get Students Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to fetch students",
    });
  }
};

// =====================================
// Delete Student
// =====================================

export const deleteStudent = async (req, res) => {
  try {
    // =================================
    // Find Student
    // =================================

    const student = await Student.findById(
      req.params.id
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // =================================
    // Delete Student Applications
    // =================================

    await Application.deleteMany({
      student: student._id,
    });

    // =================================
    // Delete Student Notifications
    // =================================

    await Notification.deleteMany({
      student: student._id,
    });

    // =================================
    // Delete Student
    // =================================

    await student.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Student and related data deleted successfully",
    });
  } catch (error) {
    console.error("Delete Student Error:", error);

    // Invalid MongoDB ID
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid student ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message || "Unable to delete student",
    });
  }
};