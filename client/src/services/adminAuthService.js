import api from "./api";

// Admin Login
export const loginAdmin = async (formData) => {
  const res = await api.post("/admin/login", formData);
  return res.data;
};

// Dashboard Data
export const getDashboard = async (token) => {
  const res = await api.get("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};