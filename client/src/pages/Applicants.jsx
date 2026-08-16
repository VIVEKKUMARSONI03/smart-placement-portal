import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function Applicants() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ===================================
  // Backend Base URL
  // ===================================

  const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000";

  // ===================================
  // Load Applicants
  // ===================================

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("companyToken");

      const res = await api.get("/company/applicants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data.applications || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load applicants"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // Update Application Status
  // ===================================

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const token = localStorage.getItem("companyToken");

      const res = await api.put(
        `/applications/${id}/status`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      await loadApplicants();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Status update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // ===================================
  // Loading State
  // ===================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="flex justify-center items-center py-20">
          <p className="text-white text-lg">
            Loading applicants...
          </p>
        </div>
      </div>
    );
  }

  // ===================================
  // UI
  // ===================================

  return (
    <div className="min-h-screen bg-slate-900 p-6">

      <h1 className="text-4xl font-bold text-white mb-8">
        Applicants
      </h1>

      {applications.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-10 text-center">
          <h2 className="text-2xl text-white">
            No Applicants Yet
          </h2>

          <p className="text-gray-400 mt-2">
            Applications for your jobs will appear here.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {applications.map((application) => {

            const isUpdating =
              updatingId === application._id;

            return (
              <div
                key={application._id}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >

                {/* Student Name */}

                <h2 className="text-2xl text-white font-bold">
                  {application.student?.name ||
                    "Unknown Student"}
                </h2>

                {/* Student Email */}

                <p className="text-gray-400 mt-2">
                  {application.student?.email ||
                    "Email not available"}
                </p>

                {/* Resume */}

                {application.student?.resume && (
                  <a
                    href={`${API_URL}${application.student.resume}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                  >
                    📄 View Resume
                  </a>
                )}

                {/* Applied Job */}

                <p className="text-purple-400 mt-4">
                  Applied For
                </p>

                <p className="text-white font-semibold">
                  {application.job?.title ||
                    "Job unavailable"}
                </p>

                {/* Current Status */}

                <div className="mt-4">
                  <span className="bg-blue-600 px-4 py-2 rounded-full text-white">
                    {application.status}
                  </span>
                </div>

                {/* Action Buttons */}

                <div className="flex flex-wrap gap-2 mt-6">

                  <button
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "Shortlisted"
                      )
                    }
                    disabled={isUpdating}
                    className="bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded"
                  >
                    {isUpdating
                      ? "Updating..."
                      : "Shortlist"}
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "Rejected"
                      )
                    }
                    disabled={isUpdating}
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded"
                  >
                    {isUpdating
                      ? "Updating..."
                      : "Reject"}
                  </button>

                  <button
                    onClick={() =>
                      updateStatus(
                        application._id,
                        "Selected"
                      )
                    }
                    disabled={isUpdating}
                    className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-3 py-2 rounded"
                  >
                    {isUpdating
                      ? "Updating..."
                      : "Select"}
                  </button>

                </div>

              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}

export default Applicants;