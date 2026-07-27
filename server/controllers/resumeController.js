import Student from "../models/Student.js";
import cloudinary from "../config/cloudinary.js";

export const uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume",
      });
    }

    const student = await Student.findById(req.student.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Purana resume delete karega (agar hai)
    if (student.resumePublicId) {
      await cloudinary.uploader.destroy(student.resumePublicId, {
        resource_type: "raw",
      });
    }

    // Naya resume upload
    const result = await cloudinary.uploader.upload_stream(
      {
        resource_type: "raw",
        folder: "smart-placement/resumes",
      },
      async (error, uploadedFile) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: error.message,
          });
        }

        student.resume = uploadedFile.secure_url;
        student.resumePublicId = uploadedFile.public_id;

        await student.save();

        res.status(200).json({
          success: true,
          message: "Resume uploaded successfully",
          resume: student.resume,
        });
      }
    );

    result.end(req.file.buffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};