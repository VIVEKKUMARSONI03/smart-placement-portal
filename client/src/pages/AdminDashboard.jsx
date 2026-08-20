import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getDashboard } from "../services/adminAuthService";
import { getAnalytics } from "../services/analyticsService";
import DashboardCharts from "../components/DashboardCharts";

function AdminDashboard() {
  const [dashboard, setDashboard] = useState({
    students: 0,
    companies: 0,
    jobs: 0,
    applications: 0,
  });

  const [analytics, setAnalytics] = useState(null);

  const [loading, setLoading] = useState(true);

  // =====================================
  // Load Dashboard
  // =====================================

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      // Dashboard counts + Analytics
      const [dashboardData, analyticsData] =
        await Promise.all([
          getDashboard(token),
          getAnalytics(),
        ]);

      setDashboard(
        dashboardData.dashboard || {
          students: 0,
          companies: 0,
          jobs: 0,
          applications: 0,
        }
      );

      setAnalytics(
        analyticsData.analytics || null
      );
    } catch (error) {
      console.error(
        "Admin Dashboard Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Unable to load admin dashboard"
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
      title: "Students",
      value: dashboard.students || 0,
      icon: "👨‍🎓",
    },
    {
      title: "Companies",
      value: dashboard.companies || 0,
      icon: "🏢",
    },
    {
      title: "Jobs",
      value: dashboard.jobs || 0,
      icon: "💼",
    },
    {
      title: "Applications",
      value: dashboard.applications || 0,
      icon: "📝",
    },
  ];

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
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading admin dashboard...
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

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">

          <div>
            <h1 className="text-4xl font-bold text-white">
              📊 Admin Dashboard
            </h1>

            <p className="text-gray-400 mt-2">
              Smart Placement Portal overview
              and management.
            </p>
          </div>

          <button
            onClick={loadAdminData}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
          >
            Refresh
          </button>

        </div>

        {/* =================================
            Dashboard Cards
        ================================= */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg"
            >

              <div className="flex items-start justify-between">

                <div>
                  <h2 className="text-gray-400">
                    {card.title}
                  </h2>

                  <p className="text-4xl text-white font-bold mt-3">
                    {card.value}
                  </p>
                </div>

                <span className="text-4xl">
                  {card.icon}
                </span>

              </div>

            </div>
          ))}

        </div>

        {/* =================================
            Application Status
        ================================= */}

        {analytics?.statusData && (
          <div className="mt-12">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-3xl text-white font-bold">
                Application Status
              </h2>

              <Link
                to="/admin/analytics"
                className="text-purple-400 hover:text-purple-300"
              >
                View Analytics →
              </Link>

            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

              {analytics.statusData.map(
                (item) => (
                  <div
                    key={item.name}
                    className="bg-slate-800 border border-slate-700 rounded-xl p-6"
                  >

                    <span
                      className={`${getStatusClass(
                        item.name
                      )} text-white px-3 py-1 rounded-full text-sm`}
                    >
                      {item.name}
                    </span>

                    <p className="text-4xl text-white font-bold mt-5">
                      {item.value}
                    </p>

                    <p className="text-gray-400 mt-1">
                      Applications
                    </p>

                  </div>
                )
              )}

            </div>

          </div>
        )}

        {/* =================================
            Admin Controls
        ================================= */}

        <div className="mt-12">

          <h2 className="text-2xl text-white font-semibold mb-6">
            Admin Controls
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">

            <Link
              to="/admin/students"
              className="bg-purple-600 hover:bg-purple-700 px-6 py-4 rounded-lg text-white text-center"
            >
              🎓 Manage Students
            </Link>

            <Link
              to="/admin/companies"
              className="bg-green-600 hover:bg-green-700 px-6 py-4 rounded-lg text-white text-center"
            >
              🏢 Manage Companies
            </Link>

            <Link
              to="/admin/jobs"
              className="bg-blue-600 hover:bg-blue-700 px-6 py-4 rounded-lg text-white text-center"
            >
              💼 Manage Jobs
            </Link>

            <Link
              to="/admin/applications"
              className="bg-pink-600 hover:bg-pink-700 px-6 py-4 rounded-lg text-white text-center"
            >
              📄 Applications
            </Link>

            <Link
              to="/admin/analytics"
              className="bg-cyan-600 hover:bg-cyan-700 px-6 py-4 rounded-lg text-white text-center"
            >
              📊 Analytics
            </Link>

          </div>

        </div>

        {/* =================================
            Charts
        ================================= */}

        {analytics && (
          <div className="mt-14">

            <h2 className="text-3xl font-bold text-white mb-6">
              Placement Charts
            </h2>

            <DashboardCharts
              analytics={analytics}
            />

          </div>
        )}

      </div>

    </div>
  );
}

export default AdminDashboard;