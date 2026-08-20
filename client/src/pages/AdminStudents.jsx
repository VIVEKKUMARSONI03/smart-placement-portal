import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================
  // Backend Base URL
  // =====================================

  const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000";

  // =====================================
  // Load Students
  // =====================================

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const res = await api.get(
        "/admin/students",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(
        res.data.students || []
      );
    } catch (error) {
      console.error(
        "Load Students Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Delete Student
  // =====================================

  const deleteStudent = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student? Their applications and notifications will also be deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const token =
        localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      // IMPORTANT:
      // Backend route is /admin/students/:id
      const res = await api.delete(
        `/admin/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data.message ||
          "Student deleted successfully"
      );

      // Remove immediately from UI
      setStudents((previousStudents) =>
        previousStudents.filter(
          (student) =>
            student._id !== id
        )
      );
    } catch (error) {
      console.error(
        "Delete Student Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // Resume URL
  // =====================================

  const getResumeUrl = (resume) => {
    if (!resume) {
      return "";
    }

    // Future support for Cloudinary/full URLs
    if (
      resume.startsWith("http://") ||
      resume.startsWith("https://")
    ) {
      return resume;
    }

    return `${API_URL}${resume}`;
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading students...
        </p>
      </div>
    );
  }

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-white">
              🎓 Manage Students
            </h1>

            <p className="text-gray-400 mt-2">
              View and manage registered students.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-lg">
            <span className="text-gray-400">
              Total Students:
            </span>

            <span className="text-white font-bold ml-2">
              {students.length}
            </span>
          </div>

        </div>

        {/* Empty State */}

        {students.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">

            <h2 className="text-2xl font-bold text-white">
              No Students Found
            </h2>

            <p className="text-gray-400 mt-2">
              Registered students will appear here.
            </p>

          </div>
        ) : (

          /* Students Table */

          <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl">

            <table className="w-full">

              <thead className="bg-slate-700/50">

                <tr className="text-left">

                  <th className="p-4 text-gray-300">
                    #
                  </th>

                  <th className="p-4 text-gray-300">
                    Name
                  </th>

                  <th className="p-4 text-gray-300">
                    Email
                  </th>

                  <th className="p-4 text-gray-300">
                    Resume
                  </th>

                  <th className="p-4 text-gray-300">
                    Score
                  </th>

                  <th className="p-4 text-gray-300">
                    Joined
                  </th>

                  <th className="p-4 text-gray-300">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {students.map(
                  (student, index) => {

                    const isDeleting =
                      deletingId ===
                      student._id;

                    return (
                      <tr
                        key={student._id}
                        className="border-t border-slate-700 hover:bg-slate-700/30"
                      >

                        {/* Number */}

                        <td className="p-4 text-gray-400">
                          {index + 1}
                        </td>

                        {/* Name */}

                        <td className="p-4 text-white font-medium">
                          {student.name ||
                            "Unknown"}
                        </td>

                        {/* Email */}

                        <td className="p-4 text-gray-300">
                          {student.email ||
                            "Not available"}
                        </td>

                        {/* Resume */}

                        <td className="p-4">

                          {student.resume ? (
                            <a
                              href={getResumeUrl(
                                student.resume
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-400 hover:text-blue-300 underline"
                            >
                              📄 View Resume
                            </a>
                          ) : (
                            <span className="text-gray-500">
                              No Resume
                            </span>
                          )}

                        </td>

                        {/* Resume Score */}

                        <td className="p-4">

                          {student.resumeScore !==
                          undefined ? (
                            <span className="bg-purple-600 text-white px-3 py-1 rounded-full">
                              {student.resumeScore}%
                            </span>
                          ) : (
                            <span className="text-gray-500">
                              —
                            </span>
                          )}

                        </td>

                        {/* Joined */}

                        <td className="p-4 text-gray-300">

                          {student.createdAt
                            ? new Date(
                                student.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : "—"}

                        </td>

                        {/* Delete */}

                        <td className="p-4">

                          <button
                            onClick={() =>
                              deleteStudent(
                                student._id
                              )
                            }
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg"
                          >
                            {isDeleting
                              ? "Deleting..."
                              : "Delete"}
                          </button>

                        </td>

                      </tr>
                    );
                  }
                )}

              </tbody>

            </table>

          </div>
        )}

      </div>
    </div>
  );
}

export default AdminStudents;