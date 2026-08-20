import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getAnalytics } from "../services/analyticsService";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  // =====================================
  // Load Analytics
  // =====================================

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);

      const data = await getAnalytics();

      setAnalytics(data.analytics || null);
    } catch (error) {
      console.error("Analytics Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading analytics...
        </p>
      </div>
    );
  }

  // =====================================
  // Error / Empty State
  // =====================================

  if (!analytics) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold text-white">
            Analytics Not Available
          </h2>

          <button
            onClick={loadAnalytics}
            className="mt-5 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const counts = analytics.counts || {};

  const statusData = analytics.statusData || [];

  // =====================================
  // Dashboard Cards
  // =====================================

  const cards = [
    {
      title: "Total Students",
      value: counts.students || 0,
      icon: "🎓",
    },
    {
      title: "Total Companies",
      value: counts.companies || 0,
      icon: "🏢",
    },
    {
      title: "Total Jobs",
      value: counts.jobs || 0,
      icon: "💼",
    },
    {
      title: "Total Applications",
      value: counts.applications || 0,
      icon: "📄",
    },
  ];

  // =====================================
  // Status Helpers
  // =====================================

  const getStatusStyle = (name) => {
    switch (name) {
      case "Pending":
        return "bg-yellow-600";

      case "Shortlisted":
        return "bg-blue-600";

      case "Selected":
        return "bg-green-600";

      case "Rejected":
        return "bg-red-600";

      default:
        return "bg-slate-600";
    }
  };

  const totalApplications =
    counts.applications || 0;

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
              📊 Placement Analytics
            </h1>

            <p className="text-gray-400 mt-2">
              Overview of students, companies,
              jobs and placement applications.
            </p>
          </div>

          <button
            onClick={loadAnalytics}
            className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg"
          >
            Refresh
          </button>

        </div>

        {/* Main Cards */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {cards.map((card) => (
            <div
              key={card.title}
              className="bg-slate-800 border border-slate-700 rounded-xl p-6"
            >
              <div className="flex justify-between items-start">

                <div>
                  <p className="text-gray-400">
                    {card.title}
                  </p>

                  <h2 className="text-4xl font-bold text-white mt-3">
                    {card.value}
                  </h2>
                </div>

                <div className="text-4xl">
                  {card.icon}
                </div>

              </div>
            </div>
          ))}

        </div>

        {/* Application Analytics */}

        <div className="mt-10">

          <h2 className="text-2xl font-bold text-white mb-5">
            Application Status
          </h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

            {statusData.map((status) => {

              const percentage =
                totalApplications > 0
                  ? Math.round(
                      (status.value /
                        totalApplications) *
                        100
                    )
                  : 0;

              return (
                <div
                  key={status.name}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-5"
                >

                  <div className="flex justify-between items-center">

                    <span
                      className={`${getStatusStyle(
                        status.name
                      )} text-white px-3 py-1 rounded-full text-sm font-semibold`}
                    >
                      {status.name}
                    </span>

                    <span className="text-gray-400">
                      {percentage}%
                    </span>

                  </div>

                  <h3 className="text-4xl font-bold text-white mt-5">
                    {status.value}
                  </h3>

                  <p className="text-gray-400 mt-1">
                    Applications
                  </p>

                  {/* Progress Bar */}

                  <div className="w-full bg-slate-700 rounded-full h-2 mt-5 overflow-hidden">

                    <div
                      className={`${getStatusStyle(
                        status.name
                      )} h-2 rounded-full transition-all duration-500`}
                      style={{
                        width: `${percentage}%`,
                      }}
                    />

                  </div>

                </div>
              );
            })}

          </div>

        </div>

        {/* Placement Summary */}

        <div className="mt-10 bg-slate-800 border border-slate-700 rounded-xl p-6">

          <h2 className="text-2xl font-bold text-white">
            Placement Summary
          </h2>

          {totalApplications === 0 ? (
            <p className="text-gray-400 mt-4">
              No applications have been submitted yet.
            </p>
          ) : (
            <div className="mt-6 space-y-5">

              {statusData.map((status) => {

                const percentage =
                  Math.round(
                    (status.value /
                      totalApplications) *
                      100
                  );

                return (
                  <div key={status.name}>

                    <div className="flex justify-between mb-2">

                      <span className="text-gray-300 font-medium">
                        {status.name}
                      </span>

                      <span className="text-white font-semibold">
                        {status.value} ({percentage}%)
                      </span>

                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">

                      <div
                        className={`${getStatusStyle(
                          status.name
                        )} h-3 rounded-full transition-all duration-500`}
                        style={{
                          width: `${percentage}%`,
                        }}
                      />

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default Analytics;