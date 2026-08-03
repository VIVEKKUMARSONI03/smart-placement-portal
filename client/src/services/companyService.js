import api from "./api";

// ==============================
// Create Job
// ==============================

export const createJob = async (jobData) => {
  const token = localStorage.getItem("companyToken");

  const res = await api.post("/jobs/create", jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ==============================
// Get My Jobs
// ==============================

export const getMyJobs = async () => {
  const token = localStorage.getItem("companyToken");

  const res = await api.get("/jobs/company/my-jobs", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ==============================
// Get All Jobs
// ==============================

export const getJobs = async () => {
  const res = await api.get("/jobs");
  return res.data;
};

// ==============================
// Delete Job
// ==============================

export const deleteJob = async (id) => {
  const token = localStorage.getItem("companyToken");

  const res = await api.delete(`/jobs/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

// ==============================
// Update Job
// ==============================

export const updateJob = async (id, jobData) => {
  const token = localStorage.getItem("companyToken");

  const res = await api.put(`/jobs/${id}`, jobData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};