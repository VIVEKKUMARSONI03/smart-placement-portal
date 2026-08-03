import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getJobs } from "../services/companyService";
import { applyJob } from "../services/studentService";

function Jobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      const data = await getJobs();
      setJobs(data.jobs);
    } catch (error) {
      toast.error("Unable to load jobs");
    }
  };

  const handleApply = async (jobId) => {
    try {
      const data = await applyJob(jobId);

      toast.success(data.message);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Application Failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Available Jobs
      </h1>

      {jobs.length === 0 ? (

        <div className="bg-slate-800 rounded-xl p-10 text-center">

          <h2 className="text-2xl text-white">
            No Jobs Available
          </h2>

        </div>

      ) : (

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => (

            <div
              key={job._id}
              className="bg-slate-800 rounded-xl p-6 border border-slate-700"
            >

              <h2 className="text-2xl text-white font-bold">
                {job.title}
              </h2>

              <p className="text-gray-400 mt-2">
                {job.company?.name}
              </p>

              <p className="text-gray-400">
                📍 {job.location}
              </p>

              <p className="text-green-400 mt-2">
                ₹ {job.salary}
              </p>

              <p className="text-gray-300 mt-4">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 mt-4">

                {job.skills?.map((skill, index) => (

                  <span
                    key={index}
                    className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>

                ))}

              </div>

              <button
                onClick={() => handleApply(job._id)}
                className="mt-6 w-full bg-purple-600 hover:bg-purple-700 py-3 rounded text-white"
              >
                Apply Now
              </button>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default Jobs;