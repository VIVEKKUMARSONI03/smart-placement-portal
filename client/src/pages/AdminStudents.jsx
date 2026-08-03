import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminStudents() {

  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.get("/admin/students", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data.students);

    } catch (error) {

      toast.error("Unable to load students");

    }

  };

  const deleteStudent = async (id) => {

    if (!window.confirm("Delete this student?")) return;

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.delete(`/admin/student/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message);

      loadStudents();

    } catch (error) {

      toast.error("Delete failed");

    }

  };

  return (

    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Manage Students
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full bg-slate-800 rounded-xl">

          <thead>

            <tr className="text-left border-b border-slate-700">

              <th className="p-4 text-white">Name</th>

              <th className="p-4 text-white">Email</th>

              <th className="p-4 text-white">Resume</th>

              <th className="p-4 text-white">Action</th>

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

                <td className="p-4">

                  {student.resume ? (

                    <a
                      href={`http://localhost:5000${student.resume}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-400"
                    >
                      View Resume
                    </a>

                  ) : (

                    <span className="text-red-400">
                      No Resume
                    </span>

                  )}

                </td>

                <td className="p-4">

                  <button
                    onClick={() => deleteStudent(student._id)}
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

    </div>

  );

}

export default AdminStudents;