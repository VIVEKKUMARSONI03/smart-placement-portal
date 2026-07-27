import api from "./api";

export const loginStudent = async (data) => {
  const response = await api.post("/students/login", data);
  return response.data;
};

export const registerStudent = async (data) => {
  const response = await api.post("/students/register", data);
  return response.data;
};