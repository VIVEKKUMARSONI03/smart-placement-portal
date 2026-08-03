import { useEffect, useState } from "react";
import { getAnalytics } from "../services/analyticsService";
import { Link } from "react-router-dom";

function StudentDashboard() {

  const [analytics, setAnalytics] = useState({
    totalJobs: 0,
    totalApplications: 0,
    selected: 0,
    rejected: 0,
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const data = await getAnalytics();
      setAnalytics(data.analytics);
    } catch (error) {
      console.log(error);
    }
  };

  const cards = [
    {
      title: "Total Jobs",
      value: analytics.totalJobs,
      color: "bg-purple-600",
    },
    {
      title: "Applications",
      value: analytics.totalApplications,
      color: "bg-blue-600",
    },
    {
      title: "Selected",
      value: analytics.selected,
      color: "bg-green-600",
    },
    {
      title: "Rejected",
      value: analytics.rejected,
      color: "bg-red-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-white">
          🎓 Student Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back! Manage your placements from one place.
        </p>

      </div>

      {/* Analytics Cards */}

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

        {cards.map((card) => (

          <div
            key={card.title}
            className={`${card.color} rounded-xl p-6 shadow-lg`}
          >

            <h2 className="text-white text-lg">
              {card.title}
            </h2>

            <h1 className="text-5xl font-bold text-white mt-3">
              {card.value}
            </h1>

          </div>

        ))}

      </div>

      {/* Quick Actions */}

      <h2 className="text-3xl font-bold text-white mt-14 mb-6">
        🚀 Quick Actions
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        <Link
          to="/jobs"
          className="bg-slate-800 hover:bg-purple-700 transition rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl text-white font-bold">
            💼 Browse Jobs
          </h2>

          <p className="text-slate-300 mt-2">
            Explore all available jobs.
          </p>
        </Link>

        <Link
          to="/recommended-jobs"
          className="bg-slate-800 hover:bg-blue-700 transition rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl text-white font-bold">
            🤖 AI Recommended Jobs
          </h2>

          <p className="text-slate-300 mt-2">
            Find jobs matching your skills.
          </p>
        </Link>

        <Link
          to="/resume-analyzer"
          className="bg-slate-800 hover:bg-green-700 transition rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl text-white font-bold">
            📄 Resume Analyzer
          </h2>

          <p className="text-slate-300 mt-2">
            Analyze and improve your resume.
          </p>
        </Link>

        <Link
          to="/applications"
          className="bg-slate-800 hover:bg-pink-700 transition rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl text-white font-bold">
            📑 My Applications
          </h2>

          <p className="text-slate-300 mt-2">
            Track your applied jobs.
          </p>
        </Link>

        <Link
          to="/profile"
          className="bg-slate-800 hover:bg-yellow-600 transition rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl text-white font-bold">
            👤 My Profile
          </h2>

          <p className="text-slate-300 mt-2">
            Update your profile details.
          </p>
        </Link>

        <Link
          to="/settings"
          className="bg-slate-800 hover:bg-red-600 transition rounded-xl p-6 shadow-lg"
        >
          <h2 className="text-2xl text-white font-bold">
            ⚙ Settings
          </h2>

          <p className="text-slate-300 mt-2">
            Manage your account settings.
          </p>
        </Link>

      </div>

    </div>
  );
}

export default StudentDashboard;