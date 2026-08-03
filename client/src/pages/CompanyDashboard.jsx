import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAnalytics } from "../services/analyticsService";

function CompanyDashboard() {

  const [analytics, setAnalytics] = useState({
    totalStudents: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
    pending: 0,
    shortlisted: 0,
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
      title: "Pending",
      value: analytics.pending,
      color: "bg-yellow-600",
    },
    {
      title: "Selected",
      value: analytics.selected,
      color: "bg-green-600",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      {/* Header */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold text-white">
          🏢 Company Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Manage your jobs, applicants and recruitment process.
        </p>

      </div>

      {/* Analytics */}

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
          to="/create-job"
          className="bg-slate-800 hover:bg-purple-700 transition rounded-xl p-6"
        >

          <h2 className="text-2xl font-bold text-white">
            ➕ Create Job
          </h2>

          <p className="text-slate-300 mt-2">
            Post a new job opening.
          </p>

        </Link>

        <Link
          to="/my-jobs"
          className="bg-slate-800 hover:bg-blue-700 transition rounded-xl p-6"
        >

          <h2 className="text-2xl font-bold text-white">
            📋 My Jobs
          </h2>

          <p className="text-slate-300 mt-2">
            View all posted jobs.
          </p>

        </Link>

        <Link
          to="/applicants"
          className="bg-slate-800 hover:bg-green-700 transition rounded-xl p-6"
        >

          <h2 className="text-2xl font-bold text-white">
            👨‍🎓 Applicants
          </h2>

          <p className="text-slate-300 mt-2">
            Review student applications.
          </p>

        </Link>

        <Link
          to="/company-profile"
          className="bg-slate-800 hover:bg-yellow-600 transition rounded-xl p-6"
        >

          <h2 className="text-2xl font-bold text-white">
            👤 Company Profile
          </h2>

          <p className="text-slate-300 mt-2">
            Update company information.
          </p>

        </Link>

      </div>

    </div>
  );

}

export default CompanyDashboard;