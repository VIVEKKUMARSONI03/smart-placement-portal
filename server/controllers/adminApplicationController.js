import Application from "../models/Application.js";

// ==========================
// Get All Applications
// ==========================

export const getAllApplications = async (req, res) => {
  try {

    const applications = await Application.find()
      .populate("student", "name email")
      .populate("job", "title");

    res.json({
      success: true,
      applications,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

// ==========================
// Delete Application
// ==========================

export const deleteApplication = async (req, res) => {

  try {

    const application = await Application.findById(req.params.id);

    if (!application) {

      return res.status(404).json({
        success: false,
        message: "Application not found",
      });

    }

    await Application.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Application deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};