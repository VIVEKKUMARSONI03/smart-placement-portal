import { useState } from "react";
import { toast } from "react-hot-toast";
import { createJob } from "../services/companyService";

function CreateJob() {
  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
    skills: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);

  // ===================================
  // Handle Input Change
  // ===================================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ===================================
  // Handle Form Submit
  // ===================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===================================
    // Basic Frontend Validation
    // ===================================

    if (
      !formData.title.trim() ||
      !formData.location.trim() ||
      !formData.description.trim() ||
      !formData.salary ||
      !formData.skills.trim() ||
      !formData.deadline
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    // ===================================
    // Validate Salary
    // ===================================

    const salary = Number(formData.salary);

    if (isNaN(salary) || salary <= 0) {
      toast.error("Salary must be greater than 0");
      return;
    }

    // ===================================
    // Validate Deadline
    // ===================================

    const selectedDeadline = new Date(
      `${formData.deadline}T23:59:59`
    );

    const today = new Date();

    if (selectedDeadline <= today) {
      toast.error("Deadline must be a future date");
      return;
    }

    try {
      setLoading(true);

      // ===================================
      // Prepare Job Data
      // ===================================

      const jobData = {
        title: formData.title.trim(),
        location: formData.location.trim(),
        salary,
        description: formData.description.trim(),

        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),

        deadline: formData.deadline,
      };

      // ===================================
      // Create Job API
      // ===================================

      const data = await createJob(jobData);

      toast.success(
        data.message || "Job created successfully"
      );

      // ===================================
      // Reset Form
      // ===================================

      setFormData({
        title: "",
        location: "",
        salary: "",
        description: "",
        skills: "",
        deadline: "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Job creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // Minimum Deadline Date
  // ===================================

  const getMinDate = () => {
    const today = new Date();

    const year = today.getFullYear();
    const month = String(
      today.getMonth() + 1
    ).padStart(2, "0");
    const day = String(
      today.getDate()
    ).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl p-8 shadow-lg">

        <h1 className="text-3xl text-white font-bold mb-8">
          Create New Job
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* Job Title */}

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          {/* Location */}

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          {/* Salary */}

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            min="1"
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          {/* Description */}

          <textarea
            rows="4"
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          {/* Skills */}

          <input
            type="text"
            name="skills"
            placeholder="React, Node.js, MongoDB"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          <p className="text-sm text-slate-400">
            Enter skills separated by commas.
          </p>

          {/* Deadline */}

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            min={getMinDate()}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          {/* Submit */}

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded text-white font-semibold"
          >
            {loading
              ? "Creating..."
              : "Create Job"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default CreateJob;