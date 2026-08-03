import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getMyApplications } from "../services/studentService";

function Applications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    try {
      const data = await getMyApplications();
      setApplications(data.applications);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Unable to load applications"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        My Applications
      </h1>

      {applications.length === 0 ? (

        <div className="bg-slate-800 p-10 rounded-xl text-center">

          <h2 className="text-2xl text-white">
            No Applications Yet
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
                {application.job?.title}
              </h2>

              <p className="text-gray-400 mt-2">
                {application.company?.name}
              </p>

              <p className="text-gray-400">
                📍 {application.job?.location}
              </p>

              <p className="text-green-400 mt-2">
                ₹ {application.job?.salary}
              </p>

              <div className="mt-5">

                <span className="bg-purple-600 text-white px-4 py-2 rounded-full">
                  {application.status}
                </span>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Applications;