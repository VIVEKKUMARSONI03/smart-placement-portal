import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminJobs() {

  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.get("/admin/jobs", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setJobs(res.data.jobs);

    } catch {

      toast.error("Unable to load jobs");

    }

  };

  const deleteJob = async (id) => {

    if (!window.confirm("Delete this job?")) return;

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.delete(
        `/admin/jobs/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      loadJobs();

    } catch {

      toast.error("Delete failed");

    }

  };

  return (

    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">

        Manage Jobs

      </h1>

      <div className="overflow-x-auto">

        <table className="w-full bg-slate-800 rounded-xl">

          <thead>

            <tr>

              <th className="p-4 text-left text-white">
                Job
              </th>

              <th className="p-4 text-left text-white">
                Company
              </th>

              <th className="p-4 text-left text-white">
                Location
              </th>

              <th className="p-4 text-left text-white">
                Salary
              </th>

              <th className="p-4 text-left text-white">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {jobs.map((job) => (

              <tr
                key={job._id}
                className="border-t border-slate-700"
              >

                <td className="p-4 text-white">

                  {job.title}

                </td>

                <td className="p-4 text-gray-300">

                  {job.company?.name}

                </td>

                <td className="p-4 text-gray-300">

                  {job.location}

                </td>

                <td className="p-4 text-green-400">

                  ₹ {job.salary}

                </td>

                <td className="p-4">

                  <button
                    onClick={() => deleteJob(job._id)}
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

export default AdminJobs;