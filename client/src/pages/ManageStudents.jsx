import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function ManageStudents() {
  const [students, setStudents] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  // ==========================
  // Load Students
  // ==========================

  const loadStudents = async () => {
    try {
      const token = localStorage.getItem("adminToken");

      const res = await api.get("/admin/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data.students || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Unable to load students"
      );
    } finally {
      setLoading(false);
    }
  };

  // ==========================
  // Search Students
  // ==========================

  const searchStudent = async (value) => {
    setKeyword(value);

    try {
      const token = localStorage.getItem("adminToken");

      if (value.trim() === "") {
        loadStudents();
        return;
      }

      const res = await api.get(
        `/search/students?keyword=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data.students || []);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Search failed"
      );
    }
  };

  // ==========================
  // Delete Student
  // ==========================

  const deleteStudent = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("adminToken");

      const res = await api.delete(
        `/admin/students/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      loadStudents();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Manage Students
      </h1>

      {/* Search */}

      <input
        type="text"
        placeholder="Search Student..."
        value={keyword}
        onChange={(e) => searchStudent(e.target.value)}
        className="w-full md:w-96 mb-8 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none"
      />

      {loading ? (

        <div className="text-white text-xl">
          Loading...
        </div>

      ) : students.length === 0 ? (

        <div className="bg-slate-800 rounded-xl p-10">

          <h2 className="text-white text-2xl">
            No Students Found
          </h2>

        </div>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full bg-slate-800 rounded-xl overflow-hidden">

            <thead className="bg-slate-700">

              <tr>

                <th className="p-4 text-left text-white">
                  Name
                </th>

                <th className="p-4 text-left text-white">
                  Email
                </th>

                <th className="p-4 text-center text-white">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {students.map((student) => (

                <tr
                  key={student._id}
                  className="border-b border-slate-700"
                >

                  <td className="p-4 text-white">
                    {student.name}
                  </td>

                  <td className="p-4 text-gray-300">
                    {student.email}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() =>
                        deleteStudent(student._id)
                      }
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                    >
                      Delete
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      )}

    </div>
  );
}

export default ManageStudents;