import Student from "../models/Student.js";
import Company from "../models/Company.js";
import Job from "../models/Job.js";
import Application from "../models/Application.js";

export const getAnalytics = async (req, res) => {
  try {

    const students = await Student.countDocuments();

    const companies = await Company.countDocuments();

    const jobs = await Job.countDocuments();

    const applications = await Application.countDocuments();

    const pending = await Application.countDocuments({
      status: "Pending",
    });

    const shortlisted = await Application.countDocuments({
      status: "Shortlisted",
    });

    const selected = await Application.countDocuments({
      status: "Selected",
    });

    const rejected = await Application.countDocuments({
      status: "Rejected",
    });

    res.json({
      success: true,

      analytics: {

        counts: {
          students,
          companies,
          jobs,
          applications,
        },

        statusData: [
          {
            name: "Pending",
            value: pending,
          },
          {
            name: "Shortlisted",
            value: shortlisted,
          },
          {
            name: "Selected",
            value: selected,
          },
          {
            name: "Rejected",
            value: rejected,
          },
        ],

      },

    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};