import {
  useEffect,
  useState,
} from "react";

import toast from "react-hot-toast";

import api from "../services/api";

function Resume() {
  const [file, setFile] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [
    loadingResume,
    setLoadingResume,
  ] = useState(true);

  const [
    deleting,
    setDeleting,
  ] = useState(false);

  const [result, setResult] =
    useState(null);

  const [
    currentResume,
    setCurrentResume,
  ] = useState("");

  const BACKEND_URL =
    import.meta.env
      .VITE_BACKEND_URL ||
    "http://localhost:5000";

  // ===================================
  // Load Current Resume
  // ===================================

  useEffect(() => {
    loadResume();
  }, []);

  const loadResume = async () => {
    try {
      setLoadingResume(true);

      const token =
        localStorage.getItem(
          "token"
        ) ||
        localStorage.getItem(
          "studentToken"
        );

      if (!token) {
        toast.error(
          "Student login required"
        );
        return;
      }

      const response =
        await api.get(
          "/resume/my-resume",
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

      const data =
        response.data;

      if (
        data.hasResume &&
        data.resume
      ) {
        setCurrentResume(
          data.resume
        );

        setResult({
          score:
            data.resumeScore || 0,

          matchedSkills:
            data.matchedSkills ||
            [],

          missingSkills:
            data.missingSkills ||
            [],

          recommendation:
            data.recommendation ||
            "",

          recommendedCourses:
            data.recommendedCourses ||
            [],
        });
      } else {
        setCurrentResume("");
        setResult(null);
      }
    } catch (error) {
      console.error(
        "Load Resume Error:",
        error
      );

      toast.error(
        error.response?.data
          ?.message ||
          "Unable to load resume"
      );
    } finally {
      setLoadingResume(false);
    }
  };

  // ===================================
  // Select Resume
  // ===================================

  const handleFileChange = (
    event
  ) => {
    const selectedFile =
      event.target.files?.[0];

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const isPdf =
      selectedFile.type ===
        "application/pdf" ||
      selectedFile.name
        .toLowerCase()
        .endsWith(".pdf");

    if (!isPdf) {
      toast.error(
        "Please select a PDF resume"
      );

      event.target.value = "";
      setFile(null);
      return;
    }

    setFile(selectedFile);
  };

  // ===================================
  // Upload / Replace Resume
  // ===================================

  const handleUpload =
    async () => {
      if (!file) {
        toast.error(
          "Please select a PDF resume"
        );
        return;
      }

      try {
        setLoading(true);

        const token =
          localStorage.getItem(
            "token"
          ) ||
          localStorage.getItem(
            "studentToken"
          );

        if (!token) {
          toast.error(
            "Student login required"
          );
          return;
        }

        const formData =
          new FormData();

        formData.append(
          "resume",
          file,
          file.name
        );

        // Native fetch so browser automatically
        // sets multipart/form-data boundary

        const response =
          await fetch(
            "/api/resume/upload",
            {
              method: "POST",

              headers: {
                Authorization:
                  `Bearer ${token}`,
              },

              body: formData,
            }
          );

        let data = {};

        try {
          data =
            await response.json();
        } catch {
          data = {};
        }

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Resume upload failed"
          );
        }

        setCurrentResume(
          data.resume
        );

        setResult({
          score:
            data.score || 0,

          matchedSkills:
            data.matchedSkills ||
            [],

          missingSkills:
            data.missingSkills ||
            [],

          recommendation:
            data.recommendation ||
            "",

          recommendedCourses:
            data.recommendedCourses ||
            [],
        });

        setFile(null);

        const fileInput =
          document.getElementById(
            "resume-file-input"
          );

        if (fileInput) {
          fileInput.value = "";
        }

        toast.success(
          data.message ||
            "Resume uploaded successfully"
        );
      } catch (error) {
        console.error(
          "Resume Upload Error:",
          error
        );

        toast.error(
          error.message ||
            "Upload failed"
        );
      } finally {
        setLoading(false);
      }
    };

  // ===================================
  // Delete Resume
  // ===================================

  const handleDelete =
    async () => {
      const confirmed =
        window.confirm(
          "Are you sure you want to delete your resume?"
        );

      if (!confirmed) {
        return;
      }

      try {
        setDeleting(true);

        const token =
          localStorage.getItem(
            "token"
          ) ||
          localStorage.getItem(
            "studentToken"
          );

        const response =
          await api.delete(
            "/resume/delete",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setCurrentResume("");
        setResult(null);
        setFile(null);

        const fileInput =
          document.getElementById(
            "resume-file-input"
          );

        if (fileInput) {
          fileInput.value = "";
        }

        toast.success(
          response.data.message ||
            "Resume deleted successfully"
        );
      } catch (error) {
        console.error(
          "Delete Resume Error:",
          error
        );

        toast.error(
          error.response?.data
            ?.message ||
            "Unable to delete resume"
        );
      } finally {
        setDeleting(false);
      }
    };

  // ===================================
  // Resume URL
  // ===================================

  const getResumeUrl = () => {
    if (!currentResume) {
      return "";
    }

    if (
      currentResume.startsWith(
        "http://"
      ) ||
      currentResume.startsWith(
        "https://"
      )
    ) {
      return currentResume;
    }

    return `${BACKEND_URL}${currentResume}`;
  };

  // ===================================
  // Loading
  // ===================================

  if (loadingResume) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading Resume...
        </p>
      </div>
    );
  }

  // ===================================
  // UI
  // ===================================

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-10">
      <div className="max-w-4xl mx-auto">

        {/* Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            📄 AI Resume Analyzer
          </h1>

          <p className="text-slate-400 mt-2">
            Upload your PDF resume,
            analyze your skills and get
            improvement recommendations.
          </p>
        </div>

        {/* Current Resume */}

        {currentResume && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div>
                <h2 className="text-xl font-bold text-white">
                  ✅ Resume Uploaded
                </h2>

                <p className="text-slate-400 mt-1">
                  You can view, replace or
                  delete your current resume.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">

                <a
                  href={getResumeUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
                >
                  👁 View Resume
                </a>

                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg"
                >
                  {deleting
                    ? "Deleting..."
                    : "🗑 Delete Resume"}
                </button>

              </div>
            </div>
          </div>
        )}

        {/* Upload Card */}

        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 md:p-8">

          <h2 className="text-2xl font-bold text-white">
            {currentResume
              ? "🔄 Replace Resume"
              : "⬆️ Upload Resume"}
          </h2>

          <p className="text-slate-400 mt-2">
            {currentResume
              ? "Select a new PDF. Your old resume will be replaced automatically after successful analysis."
              : "Select your PDF resume to start AI analysis."}
          </p>

          <div className="mt-6">
            <input
              id="resume-file-input"
              type="file"
              accept=".pdf,application/pdf"
              onChange={
                handleFileChange
              }
              className="block w-full text-slate-300 bg-slate-700 border border-slate-600 rounded-lg p-3"
            />
          </div>

          {file && (
            <div className="mt-4 bg-slate-700 rounded-lg p-4">
              <p className="text-slate-300">
                Selected:
                <span className="text-white font-semibold ml-2">
                  {file.name}
                </span>
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={
              loading || !file
            }
            className="mt-5 w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold"
          >
            {loading
              ? "Analyzing Resume..."
              : currentResume
              ? "Replace & Analyze Resume"
              : "Upload & Analyze Resume"}
          </button>

        </div>

        {/* Analysis Result */}

        {result && (
          <div className="mt-8">

            {/* Score */}

            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 mb-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h2 className="text-2xl text-green-400 font-bold">
                    Resume Score
                  </h2>

                  <p className="text-yellow-300 mt-2">
                    {result.recommendation}
                  </p>
                </div>

                <div className="text-5xl font-bold text-white">
                  {result.score}%
                </div>

              </div>
            </div>

            {/* Skills */}

            <div className="grid md:grid-cols-2 gap-6">

              {/* Matched Skills */}

              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">

                <h3 className="text-green-400 text-xl font-bold mb-4">
                  ✅ Matched Skills
                </h3>

                {result.matchedSkills
                  ?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">

                    {result.matchedSkills.map(
                      (skill) => (
                        <span
                          key={skill}
                          className="bg-green-600 px-3 py-1 rounded-full text-white"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>
                ) : (
                  <p className="text-slate-400">
                    No matched skills found.
                  </p>
                )}

              </div>

              {/* Missing Skills */}

              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl">

                <h3 className="text-red-400 text-xl font-bold mb-4">
                  📚 Missing Skills
                </h3>

                {result.missingSkills
                  ?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">

                    {result.missingSkills.map(
                      (skill) => (
                        <span
                          key={skill}
                          className="bg-red-600 px-3 py-1 rounded-full text-white"
                        >
                          {skill}
                        </span>
                      )
                    )}

                  </div>
                ) : (
                  <p className="text-green-400">
                    Great! No skills are
                    missing.
                  </p>
                )}

              </div>

            </div>

            {/* Recommended Courses */}

            {result.recommendedCourses
              ?.length > 0 && (
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-xl mt-6">

                <h3 className="text-purple-400 text-xl font-bold mb-5">
                  🎓 Recommended Learning Resources
                </h3>

                <div className="space-y-3">

                  {result.recommendedCourses.map(
                    (item) => (
                      <div
                        key={item.skill}
                        className="bg-slate-700 rounded-lg p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
                      >

                        <div>
                          <p className="text-white font-semibold capitalize">
                            {item.skill}
                          </p>

                          <p className="text-slate-400 text-sm mt-1">
                            {item.course}
                          </p>
                        </div>

                        {item.link && (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-center"
                          >
                            Learn
                          </a>
                        )}

                      </div>
                    )
                  )}

                </div>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}

export default Resume;