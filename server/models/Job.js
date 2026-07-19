import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },

    location: {
      type: String,
      required: true,
    },

    salary: {
      type: Number,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    skills: [
      {
        type: String,
      },
    ],

    deadline: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Job", jobSchema);