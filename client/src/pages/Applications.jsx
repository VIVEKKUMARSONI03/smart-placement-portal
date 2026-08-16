import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyApplications } from "../services/studentService";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // ===================================
  // Load Applications
  // ===================================

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      setLoading(true);

      const data = await getMyApplications();

      setApplications(data.applications || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load applications"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // Status Styling
  // ===================================

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

  // ===================================
  // Loading State
  // ===================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="flex justify-center items-center py-20">
          <p className="text-white text-lg">
            Loading applications...
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
        My Applications
      </h1>

      {applications.length === 0 ? (
        <div className="bg-slate-800 p-10 rounded-xl text-center">

          <h2 className="text-2xl text-white">
            No Applications Yet
          </h2>

          <p className="text-gray-400 mt-2">
            Jobs you apply for will appear here.
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {applications.map((application) => {

            const job = application.job;
            const company = application.company;

            return (
              <div
                key={application._id}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >

                {/* Job Title */}

                <h2 className="text-2xl text-white font-bold">
                  {job?.title || "Job unavailable"}
                </h2>

                {/* Company */}

                <p className="text-gray-400 mt-2">
                  🏢{" "}
                  {company?.companyName ||
                    company?.name ||
                    "Company"}
                </p>

                {/* Location */}

                <p className="text-gray-400 mt-1">
                  📍{" "}
                  {job?.location ||
                    "Location not available"}
                </p>

                {/* Salary */}

                <p className="text-green-400 mt-2 font-semibold">
                  ₹{" "}
                  {Number(
                    job?.salary || 0
                  ).toLocaleString("en-IN")}
                </p>

                {/* Deadline */}

                {job?.deadline && (
                  <p className="text-gray-400 mt-3">
                    📅 Deadline:{" "}
                    {new Date(
                      job.deadline
                    ).toLocaleDateString("en-IN")}
                  </p>
                )}

                {/* Application Date */}

                {application.createdAt && (
                  <p className="text-gray-400 mt-2">
                    📝 Applied:{" "}
                    {new Date(
                      application.createdAt
                    ).toLocaleDateString("en-IN")}
                  </p>
                )}

                {/* Status */}

                <div className="mt-5">
                  <span
                    className={`${getStatusClass(
                      application.status
                    )} text-white px-4 py-2 rounded-full inline-block`}
                  >
                    {application.status}
                  </span>
                </div>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Applications;