import api from "./api";

// =========================
// Apply Job
// =========================

export const applyJob = async (jobId) => {
  const token = localStorage.getItem("token");

  const res = await api.post(
    "/applications/apply",
    { jobId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};

// =========================
// My Applications
// =========================

export const getMyApplications = async () => {
  const token = localStorage.getItem("token");

  const res = await api.get(
    "/applications/my-applications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};