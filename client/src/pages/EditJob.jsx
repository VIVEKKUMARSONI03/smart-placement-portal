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

  useEffect(() => {
    fetchJob();
  }, []);

  const fetchJob = async () => {
    try {
      const res = await api.get(`/jobs/${id}`);

      const job = res.data.job;

      setFormData({
        title: job.title,
        location: job.location,
        salary: job.salary,
        description: job.description,
        skills: job.skills.join(", "),
        deadline: job.deadline.split("T")[0],
      });

    } catch (error) {
      toast.error("Unable to load job");
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateJob(id, {
        ...formData,
        salary: Number(formData.salary),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim()),
      });

      toast.success("Job Updated Successfully");

      navigate("/my-jobs");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Update Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      <div className="max-w-3xl mx-auto bg-slate-800 rounded-xl p-8">

        <h1 className="text-3xl text-white font-bold mb-8">
          Edit Job
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
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 rounded bg-slate-700 text-white"
            required
          />

          <input
            type="text"
            name="skills"
            placeholder="React, Node, MongoDB"
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
            className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded text-white"
          >
            Update Job
          </button>

        </form>

      </div>

    </div>
  );
}

export default EditJob;