import api from "./api";

// Company Register
export const registerCompany = async (formData) => {
  const res = await api.post("/company/register", formData);
  return res.data;
};

// Company Login
export const loginCompany = async (formData) => {
  const res = await api.post("/company/login", formData);
  return res.data;
};