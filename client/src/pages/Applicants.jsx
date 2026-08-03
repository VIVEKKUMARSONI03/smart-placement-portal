import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function Applicants() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadApplicants();
  }, []);

  const loadApplicants = async () => {
    try {
      const token = localStorage.getItem("companyToken");

      const res = await api.get("/company/applicants", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data.applications);

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Unable to load applicants"
      );

    }
  };

  const updateStatus = async (id, status) => {

    try {

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

      loadApplicants();

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Status update failed"
      );

    }

  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Applicants
      </h1>

      {applications.length === 0 ? (

        <div className="bg-slate-800 rounded-xl p-10 text-center">

          <h2 className="text-2xl text-white">
            No Applicants Yet
          </h2>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {applications.map((application) => (

            <div
              key={application._id}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >

              <h2 className="text-2xl text-white font-bold">
                {application.student?.name}
              </h2>

              <p className="text-gray-400 mt-2">
                {application.student?.email}
              </p>
                 {application.student?.resume && (
  <a
    href={`http://localhost:5000${application.student.resume}`}
    target="_blank"
    rel="noopener noreferrer"
    className="inline-block mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
  >
    📄 View Resume
  </a>
)}

              <p className="text-purple-400 mt-4">
                Applied For
              </p>

              <p className="text-white font-semibold">
                {application.job?.title}
              </p>

              <div className="mt-4">

                <span className="bg-blue-600 px-4 py-2 rounded-full text-white">
                  {application.status}
                </span>

              </div>

              <div className="flex gap-2 mt-6">

                <button
                  onClick={() =>
                    updateStatus(application._id, "Shortlisted")
                  }
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded"
                >
                  Shortlist
                </button>

                <button
                  onClick={() =>
                    updateStatus(application._id, "Rejected")
                  }
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded"
                >
                  Reject
                </button>

                <button
                  onClick={() =>
                    updateStatus(application._id, "Selected")
                  }
                  className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded"
                >
                  Select
                </button>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Applicants;