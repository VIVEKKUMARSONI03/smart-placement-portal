import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminCompanies() {

  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.get("/admin/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies(res.data.companies);

    } catch {

      toast.error("Unable to load companies");

    }

  };

  const deleteCompany = async (id) => {

    if (!window.confirm("Delete this company?")) return;

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.delete(
        `/admin/company/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      loadCompanies();

    } catch {

      toast.error("Delete failed");

    }

  };

  return (

    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">

        Manage Companies

      </h1>

      <div className="overflow-x-auto">

        <table className="w-full bg-slate-800 rounded-xl">

          <thead>

            <tr>

              <th className="p-4 text-left text-white">
                Name
              </th>

              <th className="p-4 text-left text-white">
                Email
              </th>

              <th className="p-4 text-left text-white">
                Website
              </th>

              <th className="p-4 text-left text-white">
                Location
              </th>

              <th className="p-4 text-left text-white">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {companies.map((company) => (

              <tr
                key={company._id}
                className="border-t border-slate-700"
              >

                <td className="p-4 text-white">
                  {company.name}
                </td>

                <td className="p-4 text-gray-300">
                  {company.email}
                </td>

                <td className="p-4">

                  <a
                    href={
  company.website.startsWith("http")
    ? company.website
    : `https://${company.website}`
}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-400"
                  >
                    Visit
                  </a>

                </td>

                <td className="p-4 text-gray-300">
                  {company.location}
                </td>

                <td className="p-4">

                  <button
                    onClick={() =>
                      deleteCompany(company._id)
                    }
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

export default AdminCompanies;