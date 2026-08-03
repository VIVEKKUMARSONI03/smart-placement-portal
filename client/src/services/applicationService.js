import api from "./api";

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