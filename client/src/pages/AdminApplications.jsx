import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminApplications() {

  const [applications, setApplications] = useState([]);

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

      setApplications(res.data.applications);

    } catch {

      toast.error("Unable to load applications");

    }

  };

  const deleteApplication = async (id) => {

    if (!window.confirm("Delete this application?")) return;

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

    } catch {

      toast.error("Delete failed");

    }

  };

  return (

    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">
        Manage Applications
      </h1>

      <div className="overflow-x-auto">

        <table className="w-full bg-slate-800 rounded-xl">

          <thead>

            <tr>

              <th className="p-4 text-left text-white">Student</th>

              <th className="p-4 text-left text-white">Company</th>

              <th className="p-4 text-left text-white">Job</th>

              <th className="p-4 text-left text-white">Status</th>

              <th className="p-4 text-left text-white">Action</th>

            </tr>

          </thead>

          <tbody>

            {applications.map((app) => (

              <tr
                key={app._id}
                className="border-t border-slate-700"
              >

                <td className="p-4 text-white">
                  {app.student?.name}
                </td>

                <td className="p-4 text-white">
                  {app.company?.name}
                </td>

                <td className="p-4 text-white">
                  {app.job?.title}
                </td>

                <td className="p-4 text-green-400">
                  {app.status}
                </td>

                <td className="p-4">

                  <button
                    onClick={() => deleteApplication(app._id)}
                    className="bg-red-600 px-4 py-2 rounded text-white"
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

export default AdminApplications;