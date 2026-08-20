import api from "./api";

// =====================================
// Get Admin Analytics
// =====================================

export const getAnalytics = async () => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    throw new Error("Admin token not found");
  }

  const res = await api.get("/analytics", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};