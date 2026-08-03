import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function ManageJobs() {

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

      setJobs(res.data.jobs || []);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load jobs"
      );

    } finally {

      setLoading(false);

    }

  };

  const deleteJob = async (id) => {

    if (!window.confirm("Delete this job?"))
      return;

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

        Manage Jobs

      </h1>

      {

        loading ? (

          <h2 className="text-white">

            Loading...

          </h2>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full bg-slate-800 rounded-xl overflow-hidden">

              <thead className="bg-slate-700">

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
                    Deadline
                  </th>

                  <th className="p-4 text-center text-white">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {

                  jobs.map((job) => (

                    <tr
                      key={job._id}
                      className="border-b border-slate-700"
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

                      <td className="p-4 text-gray-300">
                        ₹{job.salary}
                      </td>

                      <td className="p-4 text-gray-300">
                        {new Date(job.deadline).toLocaleDateString()}
                      </td>

                      <td className="p-4 text-center">

                        <button
                          onClick={() =>
                            deleteJob(job._id)
                          }
                          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white"
                        >
                          Delete
                        </button>

                      </td>

                    </tr>

                  ))

                }

              </tbody>

            </table>

          </div>

        )

      }

    </div>

  );

}

export default ManageJobs;