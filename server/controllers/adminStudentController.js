import Student from "../models/Student.js";

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