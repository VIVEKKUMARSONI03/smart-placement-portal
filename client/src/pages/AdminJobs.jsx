import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================
  // Load Jobs
  // =====================================

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const res = await api.get("/admin/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data.jobs || []);
    } catch (error) {
      console.error("Load Jobs Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Delete Job
  // =====================================

  const deleteJob = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this job? Related applications will also be deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const res = await api.delete(
        `/admin/jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data.message ||
          "Job deleted successfully"
      );

      // Remove job immediately from table
      setJobs((previousJobs) =>
        previousJobs.filter(
          (job) => job._id !== id
        )
      );
    } catch (error) {
      console.error("Delete Job Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading jobs...
        </p>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">
              💼 Manage Jobs
            </h1>

            <p className="text-gray-400 mt-2">
              View and manage all jobs posted by companies.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-lg">
            <span className="text-gray-400">
              Total Jobs:
            </span>

            <span className="text-white font-bold ml-2">
              {jobs.length}
            </span>
          </div>
        </div>

        {/* Empty State */}

        {jobs.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">

            <h2 className="text-2xl font-bold text-white">
              No Jobs Found
            </h2>

            <p className="text-gray-400 mt-2">
              Jobs posted by companies will appear here.
            </p>

          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl">

            <table className="w-full">

              <thead className="bg-slate-700/50">
                <tr>
                  <th className="p-4 text-left text-gray-300">
                    #
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Job
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Company
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Location
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Salary
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Deadline
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Status
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {jobs.map((job, index) => {
                  const isDeleting =
                    deletingId === job._id;

                  const expired =
                    job.deadline &&
                    new Date(job.deadline) <
                      new Date();

                  return (
                    <tr
                      key={job._id}
                      className="border-t border-slate-700 hover:bg-slate-700/30"
                    >
                      {/* Number */}

                      <td className="p-4 text-gray-400">
                        {index + 1}
                      </td>

                      {/* Job */}

                      <td className="p-4 text-white font-medium">
                        {job.title || "Untitled Job"}
                      </td>

                      {/* Company */}

                      <td className="p-4 text-gray-300">
                        {job.company?.companyName ||
                          job.company?.name ||
                          "Company unavailable"}
                      </td>

                      {/* Location */}

                      <td className="p-4 text-gray-300">
                        {job.location ||
                          "Not available"}
                      </td>

                      {/* Salary */}

                      <td className="p-4 text-green-400 font-semibold">
                        ₹
                        {Number(
                          job.salary || 0
                        ).toLocaleString("en-IN")}
                      </td>

                      {/* Deadline */}

                      <td className="p-4 text-gray-300">
                        {job.deadline
                          ? new Date(
                              job.deadline
                            ).toLocaleDateString(
                              "en-IN"
                            )
                          : "Not available"}
                      </td>

                      {/* Status */}

                      <td className="p-4">
                        {expired ? (
                          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
                            Expired
                          </span>
                        ) : (
                          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                            Active
                          </span>
                        )}
                      </td>

                      {/* Action */}

                      <td className="p-4">
                        <button
                          onClick={() =>
                            deleteJob(job._id)
                          }
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white"
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminJobs;