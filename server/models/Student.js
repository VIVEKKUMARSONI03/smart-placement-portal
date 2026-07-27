import mongoose from "mongoose";

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },
    resume: {
  type: String,
},

resumePublicId: {
  type: String,
},

    password: {
      type: String,
      required: true,
    },
  },
    
  {
    timestamps: true,
  }
);

const Student = mongoose.model("Student", studentSchema);

export default Student;