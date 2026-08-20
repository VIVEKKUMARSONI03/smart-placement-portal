import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  // =====================================
  // Load Applications
  // =====================================

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const res = await api.get(
        "/admin/applications",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplications(
        res.data.applications || []
      );
    } catch (error) {
      console.error(
        "Load Applications Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Delete Application
  // =====================================

  const deleteApplication = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const res = await api.delete(
        `/admin/applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data.message ||
          "Application deleted successfully"
      );

      setApplications((previous) =>
        previous.filter(
          (application) =>
            application._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Application Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // Status Styling
  // =====================================

  const getStatusClass = (status) => {
    switch (status) {
      case "Selected":
        return "bg-green-600";

      case "Shortlisted":
        return "bg-blue-600";

      case "Rejected":
        return "bg-red-600";

      case "Pending":
      default:
        return "bg-yellow-600";
    }
  };

  // =====================================
  // Resume URL
  // =====================================

  const getResumeUrl = (resume) => {
    if (!resume) {
      return "";
    }

    if (
      resume.startsWith("http://") ||
      resume.startsWith("https://")
    ) {
      return resume;
    }

    return `${API_URL}${resume}`;
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading applications...
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
              📄 Manage Applications
            </h1>

            <p className="text-gray-400 mt-2">
              View and manage all student job applications.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-lg">
            <span className="text-gray-400">
              Total Applications:
            </span>

            <span className="text-white font-bold ml-2">
              {applications.length}
            </span>
          </div>
        </div>

        {/* Empty State */}

        {applications.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white">
              No Applications Found
            </h2>

            <p className="text-gray-400 mt-2">
              Student job applications will appear here.
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
                    Student
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Company
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Job
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Resume
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Score
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Applied
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
                {applications.map(
                  (application, index) => {
                    const isDeleting =
                      deletingId ===
                      application._id;

                    return (
                      <tr
                        key={application._id}
                        className="border-t border-slate-700 hover:bg-slate-700/30"
                      >
                        {/* Number */}

                        <td className="p-4 text-gray-400">
                          {index + 1}
                        </td>

                        {/* Student */}

                        <td className="p-4">
                          <p className="text-white font-medium">
                            {application.student
                              ?.name ||
                              "Student unavailable"}
                          </p>

                          <p className="text-gray-400 text-sm mt-1">
                            {application.student
                              ?.email || ""}
                          </p>
                        </td>

                        {/* Company */}

                        <td className="p-4">
                          <p className="text-white">
                            {application.company
                              ?.companyName ||
                              application.company
                                ?.name ||
                              "Company unavailable"}
                          </p>

                          <p className="text-gray-400 text-sm mt-1">
                            {application.company
                              ?.email || ""}
                          </p>
                        </td>

                        {/* Job */}

                        <td className="p-4">
                          <p className="text-white font-medium">
                            {application.job
                              ?.title ||
                              "Job unavailable"}
                          </p>

                          <p className="text-gray-400 text-sm mt-1">
                            {application.job
                              ?.location || ""}
                          </p>
                        </td>

                        {/* Resume */}

                        <td className="p-4">
                          {application.student
                            ?.resume ? (
                            <a
                              href={getResumeUrl(
                                application.student
                                  .resume
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline"
                            >
                              View Resume
                            </a>
                          ) : (
                            <span className="text-gray-500">
                              No Resume
                            </span>
                          )}
                        </td>

                        {/* Score */}

                        <td className="p-4">
                          {application.student
                            ?.resumeScore !==
                          undefined ? (
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full">
                              {
                                application.student
                                  .resumeScore
                              }
                              %
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              —
                            </span>
                          )}
                        </td>

                        {/* Applied Date */}

                        <td className="p-4 text-gray-300">
                          {application.createdAt
                            ? new Date(
                                application.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "—"}
                        </td>

                        {/* Status */}

                        <td className="p-4">
                          <span
                            className={`${getStatusClass(
                              application.status
                            )} text-white px-3 py-1 rounded-full text-sm`}
                          >
                            {application.status ||
                              "Pending"}
                          </span>
                        </td>

                        {/* Delete */}

                        <td className="p-4">
                          <button
                            onClick={() =>
                              deleteApplication(
                                application._id
                              )
                            }
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
                          >
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </td>
                      </tr>
                    );
                  }
                )}
              </tbody>

            </table>

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminApplications;