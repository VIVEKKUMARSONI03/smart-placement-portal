import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  getMyJobs,
  deleteJob,
} from "../services/companyService";

function MyJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getMyJobs();
      setJobs(data.jobs);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load jobs"
      );
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?"
    );

    if (!confirmDelete) return;

    try {
      const data = await deleteJob(id);

      toast.success(data.message);

      loadJobs();

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      <div className="flex justify-between items-center mb-8">

        <h1 className="text-3xl font-bold text-white">
          My Jobs
        </h1>

        <Link
          to="/create-job"
          className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white"
        >
          + Create Job
        </Link>

      </div>

      {jobs.length === 0 ? (

        <div className="bg-slate-800 rounded-xl p-10 text-center">

          <h2 className="text-2xl text-white">
            No Jobs Found
          </h2>

          <p className="text-gray-400 mt-3">
            Create your first job.
          </p>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => (

            <div
              key={job._id}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >

              <h2 className="text-2xl font-bold text-white">
                {job.title}
              </h2>

              <p className="text-gray-400 mt-2">
                📍 {job.location}
              </p>

              <p className="text-green-400 mt-2">
                ₹ {job.salary}
              </p>

              <p className="text-gray-300 mt-4">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">

                {job.skills?.map((skill, index) => (

                  <span
                    key={index}
                    className="bg-purple-600 px-3 py-1 rounded-full text-sm text-white"
                  >
                    {skill}
                  </span>

                ))}

              </div>

              <div className="flex gap-3 mt-6">

                <Link
                  to={`/edit-job/${job._id}`}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-center py-2 rounded text-white"
                >
                  Edit
                </Link>

                <button
                  onClick={() => handleDelete(job._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded text-white"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyJobs;