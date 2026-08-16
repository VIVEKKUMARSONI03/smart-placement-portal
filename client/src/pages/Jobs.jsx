import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { getJobs } from "../services/companyService";
import {
  applyJob,
  getMyApplications,
} from "../services/studentService";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [applyingJobId, setApplyingJobId] = useState(null);

  // ===================================
  // Load Jobs + My Applications
  // ===================================

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      const [jobsData, applicationsData] =
        await Promise.all([
          getJobs(),
          getMyApplications(),
        ]);

      setJobs(jobsData.jobs || []);

      // Get job IDs for which student has already applied
      const appliedJobIds = (
        applicationsData.applications || []
      )
        .map((application) => application.job?._id)
        .filter(Boolean);

      setAppliedJobs(appliedJobIds);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Unable to load jobs"
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================
  // Apply For Job
  // ===================================

  const handleApply = async (jobId) => {
    if (appliedJobs.includes(jobId)) {
      toast.error(
        "You have already applied for this job"
      );
      return;
    }

    try {
      setApplyingJobId(jobId);

      const data = await applyJob(jobId);

      toast.success(
        data.message ||
          "Application submitted successfully"
      );

      // Immediately mark this job as applied
      setAppliedJobs((prev) => [
        ...prev,
        jobId,
      ]);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Application Failed"
      );
    } finally {
      setApplyingJobId(null);
    }
  };

  // ===================================
  // Loading State
  // ===================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="flex justify-center items-center py-20">
          <p className="text-white text-lg">
            Loading jobs...
          </p>
        </div>
      </div>
    );
  }

  // ===================================
  // UI
  // ===================================

  return (
    <div className="min-h-screen bg-slate-900 p-6">

      <h1 className="text-4xl font-bold text-white mb-8">
        Available Jobs
      </h1>

      {jobs.length === 0 ? (
        <div className="bg-slate-800 rounded-xl p-10 text-center">

          <h2 className="text-2xl text-white">
            No Jobs Available
          </h2>

          <p className="text-gray-400 mt-2">
            There are currently no active job openings.
          </p>

        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {jobs.map((job) => {
            const isApplying =
              applyingJobId === job._id;

            const hasApplied =
              appliedJobs.includes(job._id);

            return (
              <div
                key={job._id}
                className="bg-slate-800 rounded-xl p-6 border border-slate-700"
              >

                {/* Job Title */}

                <h2 className="text-2xl text-white font-bold">
                  {job.title}
                </h2>

                {/* Company */}

                <p className="text-gray-400 mt-2">
                  🏢{" "}
                  {job.company?.companyName ||
                    job.company?.name ||
                    "Company"}
                </p>

                {/* Location */}

                <p className="text-gray-400 mt-1">
                  📍 {job.location}
                </p>

                {/* Salary */}

                <p className="text-green-400 mt-2 font-semibold">
                  ₹{" "}
                  {Number(
                    job.salary || 0
                  ).toLocaleString("en-IN")}
                </p>

                {/* Description */}

                <p className="text-gray-300 mt-4">
                  {job.description}
                </p>

                {/* Skills */}

                {job.skills &&
                  job.skills.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4">

                      {job.skills.map(
                        (skill, index) => (
                          <span
                            key={`${skill}-${index}`}
                            className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm"
                          >
                            {skill}
                          </span>
                        )
                      )}

                    </div>
                  )}

                {/* Deadline */}

                {job.deadline && (
                  <p className="text-yellow-400 mt-4">
                    📅 Deadline:{" "}
                    {new Date(
                      job.deadline
                    ).toLocaleDateString("en-IN")}
                  </p>
                )}

                {/* Apply Button */}

                <button
                  onClick={() =>
                    handleApply(job._id)
                  }
                  disabled={
                    isApplying || hasApplied
                  }
                  className={`mt-6 w-full py-3 rounded text-white font-semibold transition ${
                    hasApplied
                      ? "bg-green-600 cursor-not-allowed"
                      : isApplying
                      ? "bg-purple-500 cursor-not-allowed"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {hasApplied
                    ? "✓ Applied"
                    : isApplying
                    ? "Applying..."
                    : "Apply Now"}
                </button>

              </div>
            );
          })}

        </div>
      )}

    </div>
  );
}

export default Jobs;