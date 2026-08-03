import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { getRecommendedJobs } from "../services/aiService";
import { applyJob } from "../services/applicationService";

function RecommendedJobs() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {

    try {

      const data = await getRecommendedJobs();

      setJobs(data.recommendations);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load recommendations"
      );

    } finally {

      setLoading(false);

    }

  };

  const handleApply = async (jobId) => {

    try {

      const res = await applyJob(jobId);

      toast.success(res.message);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to Apply"
      );

    }

  };

  return (

    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">

        🤖 AI Recommended Jobs

      </h1>

      {

        loading ? (

          <h2 className="text-white text-xl">

            Loading...

          </h2>

        ) : jobs.length === 0 ? (

          <div className="bg-slate-800 p-8 rounded-xl">

            <h2 className="text-white text-2xl">

              No Recommended Jobs Found

            </h2>

          </div>

        ) : (

          <div className="grid md:grid-cols-2 gap-6">

            {

              jobs.map((job) => (

                <div
                  key={job._id}
                  className="bg-slate-800 rounded-xl p-6 shadow-lg"
                >

                  <h2 className="text-2xl font-bold text-white">

                    {job.title}

                  </h2>

                  <p className="text-gray-400 mt-2">

                    Company : {job.company}

                  </p>

                  <p className="text-gray-400">

                    Location : {job.location}

                  </p>

                  <p className="text-gray-400">

                    Salary : ₹{job.salary}

                  </p>

                  <p className="text-gray-400 mt-2">

                    {job.description}

                  </p>

                  <h3 className="text-green-400 mt-5 font-semibold">

                    Matched Skills

                  </h3>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {

                      job.matchedSkills.length > 0 ? (

                        job.matchedSkills.map((skill) => (

                          <span
                            key={skill}
                            className="bg-green-600 px-3 py-1 rounded-full text-white text-sm"
                          >

                            {skill}

                          </span>

                        ))

                      ) : (

                        <span className="text-gray-400">

                          No matched skills

                        </span>

                      )

                    }

                  </div>

                  <h3 className="text-red-400 mt-5 font-semibold">

                    Missing Skills

                  </h3>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {

                      job.missingSkills.length > 0 ? (

                        job.missingSkills.map((skill) => (

                          <span
                            key={skill}
                            className="bg-red-600 px-3 py-1 rounded-full text-white text-sm"
                          >

                            {skill}

                          </span>

                        ))

                      ) : (

                        <span className="text-gray-400">

                          None 🎉

                        </span>

                      )

                    }

                  </div>

                  <div className="mt-6">

                    <h3 className="text-yellow-400 font-bold">

                      Match : {job.matchPercentage}%

                    </h3>

                    <div className="w-full bg-slate-700 rounded-full h-3 mt-2">

                      <div
                        className="bg-green-500 h-3 rounded-full"
                        style={{
                          width: `${job.matchPercentage}%`,
                        }}
                      ></div>

                    </div>

                  </div>

                  <button
                    onClick={() => handleApply(job._id)}
                    className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
                  >
                    Apply Now
                  </button>

                </div>

              ))

            }

          </div>

        )

      }

    </div>

  );

}

export default RecommendedJobs;