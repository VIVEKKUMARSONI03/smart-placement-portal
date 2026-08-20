import Application from "../models/Application.js";

// =====================================
// Get All Applications
// =====================================

export const getAllApplications = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate(
        "student",
        "name email resume resumeScore"
      )
      .populate(
        "job",
        "title location salary deadline"
      )
      .populate(
        "company",
        "companyName name email location"
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
      "Admin Get Applications Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch applications",
    });
  }
};

// =====================================
// Delete Application
// =====================================

export const deleteApplication = async (req, res) => {
  try {
    const application =
      await Application.findById(req.params.id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    await application.deleteOne();

    return res.status(200).json({
      success: true,
      message:
        "Application deleted successfully",
    });
  } catch (error) {
    console.error(
      "Admin Delete Application Error:",
      error
    );

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid application ID",
      });
    }

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete application",
    });
  }
};