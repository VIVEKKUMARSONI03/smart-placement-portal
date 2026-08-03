import { useState } from "react";
import { uploadResume } from "../services/resumeService";
import toast from "react-hot-toast";

function Resume() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState(null);

  const handleUpload = async () => {
    if (!file) {
      return toast.error("Please select a PDF resume");
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const data = await uploadResume(file, token);

      setResult(data);

      toast.success(data.message);

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Upload Failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex justify-center items-center p-10">

      <div className="bg-slate-800 rounded-xl p-8 w-full max-w-3xl">

        <h1 className="text-3xl font-bold text-white mb-6">
          AI Resume Analyzer
        </h1>

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setFile(e.target.files[0])}
          className="text-white mb-5"
        />

        <button
          onClick={handleUpload}
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg"
        >
          {loading ? "Analyzing Resume..." : "Upload & Analyze"}
        </button>

        {result && (

          <div className="mt-10">

            <div className="bg-slate-700 rounded-lg p-5 mb-5">

              <h2 className="text-2xl text-green-400 font-bold">
                Resume Score : {result.score}%
              </h2>

              <p className="text-yellow-300 mt-2">
                {result.recommendation}
              </p>

            </div>

            <div className="grid md:grid-cols-2 gap-6">

              <div className="bg-slate-700 p-5 rounded-lg">

                <h3 className="text-green-400 font-bold mb-3">
                  Matched Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {result.matchedSkills.map((skill) => (

                    <span
                      key={skill}
                      className="bg-green-600 px-3 py-1 rounded-full text-white"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>

              <div className="bg-slate-700 p-5 rounded-lg">

                <h3 className="text-red-400 font-bold mb-3">
                  Missing Skills
                </h3>

                <div className="flex flex-wrap gap-2">

                  {result.missingSkills.map((skill) => (

                    <span
                      key={skill}
                      className="bg-red-600 px-3 py-1 rounded-full text-white"
                    >
                      {skill}
                    </span>

                  ))}

                </div>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>
  );
}

export default Resume;