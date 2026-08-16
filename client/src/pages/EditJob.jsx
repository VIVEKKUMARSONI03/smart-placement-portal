import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import api from "../services/api";
import { updateJob } from "../services/companyService";

function EditJob() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    location: "",
    salary: "",
    description: "",
    skills: "",
    deadline: "",
  });

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // ===================================
  // Get Minimum Date
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

  // ===================================
  // Fetch Job
  // ===================================

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      setFetching(true);

      const res = await api.get(`/jobs/${id}`);

      const job = res.data.job;

      setFormData({
        title: job.title || "",
        location: job.location || "",
        salary: job.salary || "",
        description: job.description || "",
        skills: Array.isArray(job.skills)
          ? job.skills.join(", ")
          : "",
        deadline: job.deadline
          ? job.deadline.split("T")[0]
          : "",
      });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load job"
      );
    } finally {
      setFetching(false);
    }
  };

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
  // Handle Submit
  // ===================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ===================================
    // Required Fields
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

    // ===================================
    // Prepare Skills
    // ===================================

    const skills = formData.skills
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill !== "");

    if (skills.length === 0) {
      toast.error("Please enter at least one skill");
      return;
    }

    try {
      setLoading(true);

      await updateJob(id, {
        title: formData.title.trim(),
        location: formData.location.trim(),
        salary,
        description: formData.description.trim(),
        skills,
        deadline: formData.deadline,
      });

      toast.success("Job Updated Successfully");

      navigate("/my-jobs");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Update Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // Loading State
  // ===================================

  if (fetching) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-lg">
          Loading job...
        </p>
      </div>
    );
  }

  // ===================================
  // UI
  // ===================================

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl p-8 shadow-lg">

        <h1 className="text-3xl text-white font-bold mb-8">
          Edit Job
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
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          {/* Skills */}

          <input
            type="text"
            name="skills"
            placeholder="React, Node, MongoDB"
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

          {/* Update Button */}

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed px-8 py-3 rounded text-white font-semibold"
          >
            {loading
              ? "Updating..."
              : "Update Job"}
          </button>

        </form>
      </div>
    </div>
  );
}

export default EditJob;