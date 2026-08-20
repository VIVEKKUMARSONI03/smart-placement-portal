import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getRecommendedJobs } from "../services/aiService";
import { applyJob } from "../services/applicationService";

function RecommendedJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingId, setApplyingId] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  // ===================================
  // Load Recommended Jobs
  // ===================================

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    try {
      setLoading(true);

      const data = await getRecommendedJobs();

      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Recommendation Error:", error);

      setJobs([]);

      toast.error(
        error.response?.data?.message ||
          "Unable to load recommendations"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // Apply Job
  // ===================================

  const handleApply = async (jobId) => {
    try {
      setApplyingId(jobId);

      const res = await applyJob(jobId);

      toast.success(
        res.message || "Application submitted successfully"
      );

      setAppliedJobs((previous) => [
        ...previous,
        jobId,
      ]);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Unable to apply";

      toast.error(message);

      // If already applied, disable the button too
      if (
        message.toLowerCase().includes("already")
      ) {
        setAppliedJobs((previous) => [
          ...previous,
          jobId,
        ]);
      }
    } finally {
      setApplyingId(null);
    }
  };

  // ===================================
  // Company Name
  // ===================================

  const getCompanyName = (company) => {
    if (!company) {
      return "Company";
    }

    if (typeof company === "string") {
      return company;
    }

    return (
      company.companyName ||
      company.name ||
      "Company"
    );
  };

  // ===================================
  // Loading
  // ===================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-8">
        <div className="flex items-center justify-center py-24">
          <p className="text-white text-xl">
            Finding the best jobs for you...
          </p>
        </div>
      </div>
    );
  }

  // ===================================
  // UI
  // ===================================

  return (
    <div className="min-h-screen bg-slate-900 p-8">
      <div className="max-w-7xl mx-auto">

        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            🤖 AI Recommended Jobs
          </h1>

          <p className="text-gray-400 mt-2">
            Jobs are matched using skills detected
            from your resume.
          </p>
        </div>

        {/* No Recommendations */}

        {jobs.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 p-10 rounded-xl text-center">
            <h2 className="text-white text-2xl font-semibold">
              No Recommended Jobs Found
            </h2>

            <p className="text-gray-400 mt-3">
              Upload an updated resume or check
              again when new jobs are posted.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {jobs.map((job) => {
              const matchedSkills =
                job.matchedSkills || [];

              const allSkills =
                job.skills || [];

              const missingSkills =
                allSkills.filter(
                  (skill) =>
                    !matchedSkills.some(
                      (matchedSkill) =>
                        matchedSkill.toLowerCase() ===
                        skill.toLowerCase()
                    )
                );

              const matchPercentage =
                job.matchPercentage || 0;

              const isApplying =
                applyingId === job._id;

              const alreadyApplied =
                appliedJobs.includes(job._id);

              return (
                <div
                  key={job._id}
                  className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-lg"
                >

                  {/* Job + Match */}

                  <div className="flex justify-between gap-4 items-start">

                    <div>
                      <h2 className="text-2xl font-bold text-white">
                        {job.title}
                      </h2>

                      <p className="text-purple-400 mt-2 font-medium">
                        🏢{" "}
                        {getCompanyName(
                          job.company
                        )}
                      </p>
                    </div>

                    <div className="bg-green-600 text-white px-3 py-2 rounded-lg font-bold whitespace-nowrap">
                      {matchPercentage}% Match
                    </div>

                  </div>

                  {/* Job Details */}

                  <div className="mt-5 space-y-2">

                    <p className="text-gray-300">
                      📍{" "}
                      {job.location ||
                        "Location not available"}
                    </p>

                    <p className="text-green-400 font-semibold">
                      💰 ₹
                      {Number(
                        job.salary || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    {job.deadline && (
                      <p className="text-gray-300">
                        📅 Deadline:{" "}
                        {new Date(
                          job.deadline
                        ).toLocaleDateString(
                          "en-IN"
                        )}
                      </p>
                    )}

                  </div>

                  {/* Description */}

                  {job.description && (
                    <p className="text-gray-400 mt-5">
                      {job.description}
                    </p>
                  )}

                  {/* Matched Skills */}

                  <h3 className="text-green-400 mt-6 font-semibold">
                    ✓ Matched Skills
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {matchedSkills.length > 0 ? (
                      matchedSkills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="bg-green-600 px-3 py-1 rounded-full text-white text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-gray-400">
                        No matched skills
                      </span>
                    )}

                  </div>

                  {/* Missing Skills */}

                  <h3 className="text-red-400 mt-6 font-semibold">
                    Missing Skills
                  </h3>

                  <div className="flex flex-wrap gap-2 mt-3">

                    {missingSkills.length > 0 ? (
                      missingSkills.map(
                        (skill) => (
                          <span
                            key={skill}
                            className="bg-red-600 px-3 py-1 rounded-full text-white text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )
                    ) : (
                      <span className="text-green-400">
                        All required skills matched 🎉
                      </span>
                    )}

                  </div>

                  {/* Match Progress */}

                  <div className="mt-6">

                    <div className="flex justify-between">
                      <span className="text-gray-300">
                        Resume Match
                      </span>

                      <span className="text-yellow-400 font-bold">
                        {matchPercentage}%
                      </span>
                    </div>

                    <div className="w-full bg-slate-700 rounded-full h-3 mt-2 overflow-hidden">

                      <div
                        className="bg-green-500 h-3 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            matchPercentage,
                            100
                          )}%`,
                        }}
                      />

                    </div>

                  </div>

                  {/* Apply */}

                  <button
                    onClick={() =>
                      handleApply(job._id)
                    }
                    disabled={
                      isApplying ||
                      alreadyApplied
                    }
                    className={`mt-6 w-full py-3 rounded-lg font-semibold transition ${
                      alreadyApplied
                        ? "bg-slate-600 text-gray-300 cursor-not-allowed"
                        : "bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50"
                    }`}
                  >
                    {isApplying
                      ? "Applying..."
                      : alreadyApplied
                      ? "Applied ✓"
                      : "Apply Now"}
                  </button>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
}

export default RecommendedJobs;