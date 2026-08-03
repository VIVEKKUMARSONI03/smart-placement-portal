import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function ManageCompanies() {

  const [companies, setCompanies] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, []);

  // ==========================
  // Load Companies
  // ==========================

  const loadCompanies = async () => {

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.get("/admin/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies(res.data.companies || []);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load companies"
      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================
  // Search Company
  // ==========================

  const searchCompany = async (value) => {

    setKeyword(value);

    try {

      const token = localStorage.getItem("adminToken");

      if (value.trim() === "") {
        loadCompanies();
        return;
      }

      const res = await api.get(
        `/search/companies?keyword=${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCompanies(res.data.companies || []);

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Search failed"
      );

    }

  };

  // ==========================
  // Delete Company
  // ==========================

  const deleteCompany = async (id) => {

    if (!window.confirm("Delete this company?"))
      return;

    try {

      const token = localStorage.getItem("adminToken");

      const res = await api.delete(
        `/admin/companies/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(res.data.message);

      loadCompanies();

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Delete failed"
      );

    }

  };

  return (

    <div className="min-h-screen bg-slate-900 p-8">

      <h1 className="text-4xl font-bold text-white mb-8">

        Manage Companies

      </h1>

      <input
        type="text"
        placeholder="Search Company..."
        value={keyword}
        onChange={(e) => searchCompany(e.target.value)}
        className="w-full md:w-96 mb-8 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white outline-none"
      />

      {

        loading ? (

          <h2 className="text-white text-xl">
            Loading...
          </h2>

        ) : companies.length === 0 ? (

          <div className="bg-slate-800 rounded-xl p-10">

            <h2 className="text-white text-2xl">

              No Companies Found

            </h2>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full bg-slate-800 rounded-xl overflow-hidden">

              <thead className="bg-slate-700">

                <tr>

                  <th className="p-4 text-left text-white">
                    Company
                  </th>

                  <th className="p-4 text-left text-white">
                    Email
                  </th>

                  <th className="p-4 text-left text-white">
                    Location
                  </th>

                  <th className="p-4 text-center text-white">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody>

                {

                  companies.map((company) => (

                    <tr
                      key={company._id}
                      className="border-b border-slate-700"
                    >

                      <td className="p-4 text-white">
                        {company.name}
                      </td>

                      <td className="p-4 text-gray-300">
                        {company.email}
                      </td>

                      <td className="p-4 text-gray-300">
                        {company.location}
                      </td>

                      <td className="p-4 text-center">

                        <button
                          onClick={() =>
                            deleteCompany(company._id)
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

export default ManageCompanies;