import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../services/api";

function StudentDashboard() {
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
  // Load Dashboard
  // =====================================

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("studentToken");

      if (!token) {
        toast.error("Student login required");
        return;
      }

      // =====================================
      // Load Jobs + Student Applications
      // =====================================

      const [jobsResponse, applicationsResponse] =
        await Promise.all([
          api.get("/jobs"),

          api.get("/applications/my-applications", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);

      // =====================================
      // Jobs
      // =====================================

      const jobs =
        jobsResponse.data.jobs ||
        jobsResponse.data.data ||
        [];

      // =====================================
      // Applications
      // =====================================

      const applications =
        applicationsResponse.data.applications ||
        applicationsResponse.data.data ||
        [];

      // =====================================
      // Status Counts
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
      // Update Dashboard
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
        "Student Dashboard Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Dashboard Cards
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
          Loading Student Dashboard...
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
              🎓 Student Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Welcome back! Manage your placements
              from one place.
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
            Analytics Cards
        ===================================== */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {cards.map((card) => (
            <div
              key={card.title}
              className={`${card.color} rounded-xl p-6 shadow-lg`}
            >
              <div className="flex items-start justify-between">

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
            Application Summary
        ===================================== */}

        <div className="mt-12 bg-slate-800 border border-slate-700 rounded-xl p-6">

          <h2 className="text-2xl font-bold text-white">
            📊 Application Summary
          </h2>

          {analytics.totalApplications === 0 ? (
            <div className="mt-5">

              <p className="text-slate-400">
                You haven't applied to any jobs yet.
              </p>

              <Link
                to="/jobs"
                className="inline-block mt-4 bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
              >
                Browse Jobs
              </Link>

            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">

              {/* Pending */}

              <div className="bg-slate-700 rounded-lg p-5">
                <p className="text-yellow-400 font-semibold">
                  Pending
                </p>

                <p className="text-3xl text-white font-bold mt-2">
                  {analytics.pending}
                </p>
              </div>

              {/* Shortlisted */}

              <div className="bg-slate-700 rounded-lg p-5">
                <p className="text-cyan-400 font-semibold">
                  Shortlisted
                </p>

                <p className="text-3xl text-white font-bold mt-2">
                  {analytics.shortlisted}
                </p>
              </div>

              {/* Selected */}

              <div className="bg-slate-700 rounded-lg p-5">
                <p className="text-green-400 font-semibold">
                  Selected
                </p>

                <p className="text-3xl text-white font-bold mt-2">
                  {analytics.selected}
                </p>
              </div>

              {/* Rejected */}

              <div className="bg-slate-700 rounded-lg p-5">
                <p className="text-red-400 font-semibold">
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

          {/* Browse Jobs */}

          <Link
            to="/jobs"
            className="bg-slate-800 border border-slate-700 hover:bg-purple-700 transition rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl text-white font-bold">
              💼 Browse Jobs
            </h2>

            <p className="text-slate-300 mt-2">
              Explore all available jobs.
            </p>
          </Link>

          {/* Recommended Jobs */}

          <Link
            to="/recommended-jobs"
            className="bg-slate-800 border border-slate-700 hover:bg-blue-700 transition rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl text-white font-bold">
              🤖 AI Recommended Jobs
            </h2>

            <p className="text-slate-300 mt-2">
              Find jobs matching your resume skills.
            </p>
          </Link>

          {/* Resume */}

          <Link
            to="/resume"
            className="bg-slate-800 border border-slate-700 hover:bg-green-700 transition rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl text-white font-bold">
              📄 Resume Analyzer
            </h2>

            <p className="text-slate-300 mt-2">
              Upload, analyze and improve your resume.
            </p>
          </Link>

          {/* Applications */}

          <Link
            to="/applications"
            className="bg-slate-800 border border-slate-700 hover:bg-pink-700 transition rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl text-white font-bold">
              📑 My Applications
            </h2>

            <p className="text-slate-300 mt-2">
              Track your applied jobs and status.
            </p>
          </Link>

          {/* Notifications */}

          <Link
            to="/notifications"
            className="bg-slate-800 border border-slate-700 hover:bg-cyan-700 transition rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl text-white font-bold">
              🔔 Notifications
            </h2>

            <p className="text-slate-300 mt-2">
              Check application status updates.
            </p>
          </Link>

          {/* Profile */}

          <Link
            to="/profile"
            className="bg-slate-800 border border-slate-700 hover:bg-yellow-600 transition rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl text-white font-bold">
              👤 My Profile
            </h2>

            <p className="text-slate-300 mt-2">
              Update your profile and skills.
            </p>
          </Link>

          {/* Settings */}

          <Link
            to="/settings"
            className="bg-slate-800 border border-slate-700 hover:bg-red-600 transition rounded-xl p-6 shadow-lg"
          >
            <h2 className="text-2xl text-white font-bold">
              ⚙️ Settings
            </h2>

            <p className="text-slate-300 mt-2">
              Manage your account settings.
            </p>
          </Link>

        </div>

      </div>

    </div>
  );
}

export default StudentDashboard;