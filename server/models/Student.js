import mongoose from "mongoose";

const studentSchema =
  new mongoose.Schema(
    {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
      },

      password: {
        type: String,
        required: true,
        select: false,
      },

      phone: {
        type: String,
        default: "",
      },

      college: {
        type: String,
        default: "",
      },

      branch: {
        type: String,
        default: "",
      },

      cgpa: {
        type: Number,
        default: 0,
      },

      skills: [
        {
          type: String,
        },
      ],

      github: {
        type: String,
        default: "",
      },

      linkedin: {
        type: String,
        default: "",
      },

      // =====================================
      // Profile Image
      // =====================================

      profileImage: {
        type: String,
        default: "",
      },

      profileImagePublicId: {
        type: String,
        default: "",
      },

      bio: {
        type: String,
        default: "",
      },

      // =====================================
      // Resume
      // =====================================

      resume: {
        type: String,
        default: "",
      },

      resumePublicId: {
        type: String,
        default: "",
      },

      resumeText: {
        type: String,
        default: "",
      },

      resumeScore: {
        type: Number,
        default: 0,
      },
    },
    {
      timestamps: true,
    }
  );

export default mongoose.model(
  "Student",
  studentSchema
);