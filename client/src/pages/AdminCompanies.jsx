import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  // =====================================
  // Load Companies
  // =====================================

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    try {
      setLoading(true);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const res = await api.get("/admin/companies", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCompanies(res.data.companies || []);
    } catch (error) {
      console.error("Load Companies Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Unable to load companies"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================
  // Delete Company
  // =====================================

  const deleteCompany = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company? Its jobs and related applications will also be deleted."
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      const token = localStorage.getItem("adminToken");

      if (!token) {
        toast.error("Admin login required");
        return;
      }

      const res = await api.delete(
        `/admin/companies/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data.message ||
          "Company deleted successfully"
      );

      setCompanies((previousCompanies) =>
        previousCompanies.filter(
          (company) => company._id !== id
        )
      );
    } catch (error) {
      console.error("Delete Company Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Delete failed"
      );
    } finally {
      setDeletingId(null);
    }
  };

  // =====================================
  // Website URL
  // =====================================

  const getWebsiteUrl = (website) => {
    if (!website) {
      return null;
    }

    const value = website.trim();

    if (!value) {
      return null;
    }

    if (
      value.startsWith("http://") ||
      value.startsWith("https://")
    ) {
      return value;
    }

    return `https://${value}`;
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading companies...
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
              🏢 Manage Companies
            </h1>

            <p className="text-gray-400 mt-2">
              View and manage registered companies.
            </p>
          </div>

          <div className="bg-slate-800 border border-slate-700 px-5 py-3 rounded-lg">
            <span className="text-gray-400">
              Total Companies:
            </span>

            <span className="text-white font-bold ml-2">
              {companies.length}
            </span>
          </div>
        </div>

        {/* Empty State */}

        {companies.length === 0 ? (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-10 text-center">
            <h2 className="text-2xl font-bold text-white">
              No Companies Found
            </h2>

            <p className="text-gray-400 mt-2">
              Registered companies will appear here.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-slate-800 border border-slate-700 rounded-xl">

            <table className="w-full">

              <thead className="bg-slate-700/50">
                <tr>
                  <th className="p-4 text-left text-gray-300">
                    #
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Name
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Email
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Website
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Location
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Joined
                  </th>

                  <th className="p-4 text-left text-gray-300">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {companies.map((company, index) => {
                  const websiteUrl =
                    getWebsiteUrl(company.website);

                  const isDeleting =
                    deletingId === company._id;

                  return (
                    <tr
                      key={company._id}
                      className="border-t border-slate-700 hover:bg-slate-700/30"
                    >
                      <td className="p-4 text-gray-400">
                        {index + 1}
                      </td>

                      <td className="p-4 text-white font-medium">
                        {company.companyName ||
                          company.name ||
                          "Unknown Company"}
                      </td>

                      <td className="p-4 text-gray-300">
                        {company.email ||
                          "Not available"}
                      </td>

                      <td className="p-4">
                        {websiteUrl ? (
                          <a
                            href={websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 underline"
                          >
                            Visit Website
                          </a>
                        ) : (
                          <span className="text-gray-500">
                            Not available
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-gray-300">
                        {company.location ||
                          "Not available"}
                      </td>

                      <td className="p-4 text-gray-300">
                        {company.createdAt
                          ? new Date(
                              company.createdAt
                            ).toLocaleDateString("en-IN")
                          : "—"}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() =>
                            deleteCompany(company._id)
                          }
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed px-4 py-2 rounded-lg text-white"
                        >
                          {isDeleting
                            ? "Deleting..."
                            : "Delete"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>

            </table>

          </div>
        )}
      </div>
    </div>
  );
}

export default AdminCompanies;