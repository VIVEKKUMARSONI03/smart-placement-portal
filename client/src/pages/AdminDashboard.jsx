import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getDashboard } from "../services/adminAuthService";
import DashboardCharts from "../components/DashboardCharts";
import api from "../services/api";

function AdminDashboard() {

  const [dashboard, setDashboard] = useState({
    students: 0,
    companies: 0,
    jobs: 0,
    applications: 0,
  });

  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {

    loadDashboard();
    loadAnalytics();

  }, []);

  // ==========================
  // Dashboard Counts
  // ==========================

  const loadDashboard = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const data = await getDashboard(token);

      setDashboard(data.dashboard);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load dashboard"
      );

    }

  };

  // ==========================
  // Analytics
  // ==========================

  const loadAnalytics = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.get(
        "/admin/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setAnalytics(res.data.analytics);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load analytics"
      );

    }

  };

  return (

    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-10">

        📊 Admin Dashboard

      </h1>

      {/* ================= Dashboard Cards ================= */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

          <h2 className="text-gray-400">

            👨‍🎓 Students

          </h2>

          <p className="text-4xl text-white font-bold mt-2">

            {dashboard.students}

          </p>

        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

          <h2 className="text-gray-400">

            🏢 Companies

          </h2>

          <p className="text-4xl text-white font-bold mt-2">

            {dashboard.companies}

          </p>

        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

          <h2 className="text-gray-400">

            💼 Jobs

          </h2>

          <p className="text-4xl text-white font-bold mt-2">

            {dashboard.jobs}

          </p>

        </div>

        <div className="bg-slate-800 rounded-xl p-6 shadow-lg">

          <h2 className="text-gray-400">

            📝 Applications

          </h2>

          <p className="text-4xl text-white font-bold mt-2">

            {dashboard.applications}

          </p>

        </div>

      </div>

      {/* ================= Status Cards ================= */}

      {

        analytics && (

          <>

            <h2 className="text-3xl text-white font-bold mt-12 mb-6">

              Application Status

            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

              {

                analytics.statusData.map((item) => (

                  <div
                    key={item.name}
                    className="bg-slate-800 rounded-xl p-6 shadow-lg"
                  >

                    <h2 className="text-gray-400">

                      {item.name}

                    </h2>

                    <p className="text-4xl text-white font-bold mt-2">

                      {item.value}

                    </p>

                  </div>

                ))

              }

            </div>

          </>

        )

      }

      {/* ================= Admin Controls ================= */}

      <div className="mt-12">

        <h2 className="text-2xl text-white font-semibold mb-6">

          Admin Controls

        </h2>

        <div className="flex flex-wrap gap-4">

          <Link
            to="/admin/students"
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white"
          >
            Manage Students
          </Link>

          <Link
            to="/admin/companies"
            className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-lg text-white"
          >
            Manage Companies
          </Link>

          <Link
            to="/admin/jobs"
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg text-white"
          >
            Manage Jobs
          </Link>

          <Link
            to="/admin/applications"
            className="bg-pink-600 hover:bg-pink-700 px-6 py-3 rounded-lg text-white"
          >
            Manage Applications
          </Link>

        </div>

      </div>

      {/* ================= Charts ================= */}

      {

        analytics && (

          <div className="mt-14">

            <DashboardCharts analytics={analytics} />

          </div>

        )

      }

    </div>

  );

}

export default AdminDashboard;