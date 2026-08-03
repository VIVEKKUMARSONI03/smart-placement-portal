import api from "./api";

export const searchStudents = async (keyword) => {
  const res = await api.get(
    `/search/students?keyword=${keyword}`
  );

  return res.data.students;
};