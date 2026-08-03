import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function ResumeAnalyzer() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please select a PDF Resume");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("resume", file);

      const token = localStorage.getItem("token");

      const res = await api.post("/resume/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      setResult(res.data);

      toast.success("Resume Uploaded & Analyzed");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Resume Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-8">
      <div className="bg-slate-800 w-full max-w-4xl rounded-2xl p-8">

        <h1 className="text-4xl font-bold text-white mb-8">
          🤖 AI Resume Analyzer
        </h1>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-white mb-6"
        />

        <button
          onClick={handleAnalyze}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
        >
          {loading ? "Analyzing..." : "Upload & Analyze"}
        </button>

        {result && (
          <div className="mt-8">

            {/* Score */}
            <div className="bg-slate-700 rounded-lg p-5">
              <h2 className="text-3xl text-green-400 font-bold">
                Resume Score : {result.score}%
              </h2>

              <p className="text-yellow-300 mt-2">
                {result.recommendation}
              </p>

              {result.potentialScore && (
                <p className="text-cyan-400 mt-3 font-semibold">
                  Potential Score After Learning :
                  {" "}
                  {result.potentialScore}%
                </p>
              )}
            </div>

            {/* Skills */}
            <div className="grid md:grid-cols-2 gap-5 mt-5">

              <div className="bg-slate-700 rounded-lg p-5">
                <h3 className="text-green-400 text-xl font-bold mb-3">
                  ✅ Matched Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {result.matchedSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-green-600 text-white px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-slate-700 rounded-lg p-5">
                <h3 className="text-red-400 text-xl font-bold mb-3">
                  ❌ Missing Skills
                </h3>

                <div className="flex flex-wrap gap-2">
                  {result.missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="bg-red-600 text-white px-3 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

            </div>

            {/* Recommended Courses */}
            {result.recommendedCourses &&
              result.recommendedCourses.length > 0 && (

                <div className="bg-slate-700 rounded-lg p-6 mt-6">

                  <h3 className="text-blue-400 text-2xl font-bold mb-4">
                    📚 Recommended Courses
                  </h3>

                  <div className="space-y-4">

                    {result.recommendedCourses.map((course, index) => (

                      <div
                        key={index}
                        className="bg-slate-800 rounded-lg p-4"
                      >
                        <h4 className="text-white font-bold">
                          {course.skill}
                        </h4>

                        <p className="text-green-400 mt-1">
                          {course.course}
                        </p>

                        <a
                          href={course.link}
                          target="_blank"
                          rel="noreferrer"
                          className="text-cyan-400 underline"
                        >
                          {course.link}
                        </a>
                      </div>

                    ))}

                  </div>

                </div>

              )}

          </div>
        )}

      </div>
    </div>
  );
}

export default ResumeAnalyzer;