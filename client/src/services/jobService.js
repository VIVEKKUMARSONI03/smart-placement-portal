import api from "./api";

// Get All Jobs
export const getAllJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};

// Get Single Job
export const getJobById = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};