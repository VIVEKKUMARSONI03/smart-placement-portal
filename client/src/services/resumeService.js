import api from "./api";

// Upload Resume
export const uploadResume = async (file, token) => {

  const formData = new FormData();

  formData.append("resume", file);

  const res = await api.post(
    "/resume/upload",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};

// Get Resume
export const getResume = async (token) => {

  const res = await api.get(
    "/resume/my-resume",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data;
};