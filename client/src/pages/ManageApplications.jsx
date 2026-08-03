import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function ManageApplications() {

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.get("/admin/applications", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setApplications(res.data.applications || []);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load applications"
      );

    } finally {

      setLoading(false);

    }

  };

  const deleteApplication = async (id) => {

    if (!window.confirm("Delete this application?"))
      return;

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.delete(
        `/admin/applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      loadApplications();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete Failed"
      );

    }

  };

  return (
    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Manage Applications
      </h1>

      {loading ? (

        <h2 className="text-white">Loading...</h2>

      ) : (

        <div className="overflow-x-auto">

          <table className="w-full bg-slate-800 rounded-xl overflow-hidden">

            <thead className="bg-slate-700">

              <tr>

                <th className="p-4 text-left text-white">Student</th>

                <th className="p-4 text-left text-white">Email</th>

                <th className="p-4 text-left text-white">Job</th>

                <th className="p-4 text-center text-white">Action</th>

              </tr>

            </thead>

            <tbody>

              {applications.map((app) => (

                <tr
                  key={app._id}
                  className="border-b border-slate-700"
                >

                  <td className="p-4 text-white">
                    {app.student?.name}
                  </td>

                  <td className="p-4 text-gray-300">
                    {app.student?.email}
                  </td>

                  <td className="p-4 text-gray-300">
                    {app.job?.title}
                  </td>

                  <td className="p-4 text-center">

                    <button
                      onClick={() =>
                        deleteApplication(app._id)
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

export default ManageApplications;