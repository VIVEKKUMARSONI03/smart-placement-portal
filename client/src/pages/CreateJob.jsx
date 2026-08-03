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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const jobData = {
        ...formData,
        salary: Number(formData.salary),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== ""),
      };

      const data = await createJob(jobData);

      toast.success(data.message);

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
        error.response?.data?.message || "Job creation failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl p-8 shadow-lg">

        <h1 className="text-3xl text-white font-bold mb-8">
          Create New Job
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          <input
            type="number"
            name="salary"
            placeholder="Salary"
            value={formData.salary}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          <textarea
            rows="4"
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="React, Node.js, MongoDB"
            value={formData.skills}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
          />

          <input
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded text-white font-semibold"
          >
            {loading ? "Creating..." : "Create Job"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CreateJob;