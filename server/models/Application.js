import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Shortlisted",
        "Rejected",
        "Selected",
      ],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  }
);

// Prevent the same student from applying to the same job twice
applicationSchema.index(
  { student: 1, job: 1 },
  { unique: true }
);

const Application = mongoose.model(
  "Application",
  applicationSchema
);

export default Application;