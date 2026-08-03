import api from "./api";

// =====================================
// AI Resume Analyzer
// =====================================

export const analyzeResume = async (resumeText, skills = []) => {

  const res = await api.post("/ai/resume-score", {
    resumeText,
    skills,
  });

  return res.data;

};

// =====================================
// AI Job Recommendation
// =====================================

export const getRecommendedJobs = async () => {

  const token = localStorage.getItem("token");

  const res = await api.get("/ai/jobs/recommend", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;

};