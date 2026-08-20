import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function CompanyDashboard() {
  const [loading, setLoading] = useState(true);

  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    totalApplications: 0,
    pending: 0,
    shortlisted: 0,
    selected: 0,
    rejected: 0,
  });

  // =====================================
  // Load Company Dashboard
  // =====================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("companyToken");

      if (!token) {
        toast.error("Company login required");
        return;
      }

      // =====================================
      // Load Company Jobs + Applicants
      // =====================================

      const [jobsResponse, applicantsResponse] =
        await Promise.all([
          api.get("/jobs/company/my-jobs", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),

          api.get("/company/applicants", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      const jobs = jobsResponse.data.jobs || [];

      const applications =
        applicantsResponse.data.applications || [];

      // =====================================
      // Application Status Counts
      // =====================================

      const pending = applications.filter(
        (application) =>
          application.status === "Pending"
      ).length;

      const shortlisted = applications.filter(
        (application) =>
          application.status === "Shortlisted"
      ).length;

      const selected = applications.filter(
        (application) =>
          application.status === "Selected"
      ).length;

      const rejected = applications.filter(
        (application) =>
          application.status === "Rejected"
      ).length;

      // =====================================
      // Update Analytics
      // =====================================

      setAnalytics({
        totalJobs: jobs.length,
        totalApplications: applications.length,
        pending,
        shortlisted,
        selected,
        rejected,
      });
    } catch (error) {
      console.error(
        "Company Dashboard Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load company dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Analytics Cards
  // =====================================

  const cards = [
    {
      title: "Total Jobs",
      value: analytics.totalJobs,
      icon: "💼",
      color: "bg-purple-600",
    },

    {
      title: "Applications",
      value: analytics.totalApplications,
      icon: "📄",
      color: "bg-blue-600",
    },

    {
      title: "Pending",
      value: analytics.pending,
      icon: "⏳",
      color: "bg-yellow-600",
    },

    {
      title: "Shortlisted",
      value: analytics.shortlisted,
      icon: "⭐",
      color: "bg-cyan-600",
    },

    {
      title: "Selected",
      value: analytics.selected,
      icon: "✅",
      color: "bg-green-600",
    },

    {
      title: "Rejected",
      value: analytics.rejected,
      icon: "❌",
      color: "bg-red-600",
    },
  ];

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading Company Dashboard...
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

        {/* =====================================
            Header
        ===================================== */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold text-white">
              🏢 Company Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Manage your jobs, applicants and
              recruitment process.
            </p>
          </div>

          <button
            type="button"
            onClick={loadDashboard}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg transition"
          >
            🔄 Refresh
          </button>
        </div>

        {/* =====================================
            Analytics
        ===================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div
              key={card.title}
              className={`${card.color} rounded-xl p-6 shadow-lg`}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-white text-lg">
                    {card.title}
                  </h2>

                  <p className="text-5xl font-bold text-white mt-3">
                    {card.value}
                  </p>
                </div>

                <span className="text-3xl">
                  {card.icon}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* =====================================
            Recruitment Summary
        ===================================== */}

        <div className="mt-12 bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-white">
            📊 Recruitment Summary
          </h2>

          {analytics.totalApplications === 0 ? (
            <p className="text-gray-400 mt-4">
              No applications received yet.
            </p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

              {/* Pending */}

              <div className="bg-slate-700 rounded-lg p-5">
                <p className="text-yellow-400">
                  Pending
                </p>

                <p className="text-3xl text-white font-bold mt-2">
                  {analytics.pending}
                </p>
              </div>

              {/* Shortlisted */}

              <div className="bg-slate-700 rounded-lg p-5">
                <p className="text-cyan-400">
                  Shortlisted
                </p>

                <p className="text-3xl text-white font-bold mt-2">
                  {analytics.shortlisted}
                </p>
              </div>

              {/* Selected */}

              <div className="bg-slate-700 rounded-lg p-5">
                <p className="text-green-400">
                  Selected
                </p>

                <p className="text-3xl text-white font-bold mt-2">
                  {analytics.selected}
                </p>
              </div>

              {/* Rejected */}

              <div className="bg-slate-700 rounded-lg p-5">
                <p className="text-red-400">
                  Rejected
                </p>

                <p className="text-3xl text-white font-bold mt-2">
                  {analytics.rejected}
                </p>
              </div>

            </div>
          )}
        </div>

        {/* =====================================
            Quick Actions
        ===================================== */}

        <h2 className="text-3xl font-bold text-white mt-14 mb-6">
          🚀 Quick Actions
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Create Job */}

          <Link
            to="/create-job"
            className="bg-slate-800 border border-slate-700 hover:bg-purple-700 transition rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white">
              ➕ Create Job
            </h2>

            <p className="text-slate-300 mt-2">
              Post a new job opening.
            </p>
          </Link>

          {/* My Jobs */}

          <Link
            to="/my-jobs"
            className="bg-slate-800 border border-slate-700 hover:bg-blue-700 transition rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white">
              📋 My Jobs
            </h2>

            <p className="text-slate-300 mt-2">
              View, edit and delete posted jobs.
            </p>
          </Link>

          {/* Applicants */}

          <Link
            to="/applicants"
            className="bg-slate-800 border border-slate-700 hover:bg-green-700 transition rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white">
              👨‍🎓 Applicants
            </h2>

            <p className="text-slate-300 mt-2">
              Review student applications.
            </p>
          </Link>

          {/* Company Profile */}

          <Link
            to="/company-profile"
            className="bg-slate-800 border border-slate-700 hover:bg-yellow-600 transition rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white">
              🏢 Company Profile
            </h2>

            <p className="text-slate-300 mt-2">
              Update company information and logo.
            </p>
          </Link>

          {/* Company Settings */}

          <Link
            to="/company-settings"
            className="bg-slate-800 border border-slate-700 hover:bg-indigo-700 transition rounded-xl p-6"
          >
            <h2 className="text-2xl font-bold text-white">
              ⚙️ Company Settings
            </h2>

            <p className="text-slate-300 mt-2">
              Change your company account password.
            </p>
          </Link>

        </div>
      </div>
    </div>
  );
}

export default CompanyDashboard;