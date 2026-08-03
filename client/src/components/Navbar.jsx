import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";
import { CompanyAuthContext } from "../context/CompanyAuthContext";

function Navbar() {

  const navigate = useNavigate();

  const { student, setStudent } = useContext(AuthContext);

  const companyContext = useContext(CompanyAuthContext);

  const company = companyContext?.company;
  const setCompany = companyContext?.setCompany;

  const studentToken = localStorage.getItem("token");
  const companyToken = localStorage.getItem("companyToken");
  const adminToken = localStorage.getItem("adminToken");

  // =========================
  // Logout
  // =========================

  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("companyToken");
    localStorage.removeItem("adminToken");

    if (setStudent) setStudent(null);
    if (setCompany) setCompany(null);

    navigate("/");

  };

  return (

    <nav className="bg-[#0F172A] border-b border-slate-700 shadow-lg">

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}

        <Link
          to="/"
          className="text-2xl font-bold text-purple-400"
        >
          Smart Placement
        </Link>

        {/* Menu */}

        <div className="flex items-center gap-3">

          {/* ================= Student ================= */}

          {studentToken && (

            <>

              <Link
                to="/dashboard"
                className="text-white hover:text-purple-400"
              >
                Dashboard
              </Link>

              <Link
                to="/jobs"
                className="text-white hover:text-purple-400"
              >
                Jobs
              </Link>

              <Link
                to="/recommended-jobs"
                className="text-white hover:text-purple-400"
              >
                AI Jobs
              </Link>

              <Link
                to="/resume-analyzer"
                className="text-white hover:text-purple-400"
              >
                Resume AI
              </Link>

              <Link
                to="/applications"
                className="text-white hover:text-purple-400"
              >
                Applications
              </Link>

            </>

          )}

          {/* ================= Company ================= */}

          {companyToken && (

            <>

              <Link
                to="/company-dashboard"
                className="text-white hover:text-green-400"
              >
                Dashboard
              </Link>

              <Link
                to="/create-job"
                className="text-white hover:text-green-400"
              >
                Create Job
              </Link>

              <Link
                to="/my-jobs"
                className="text-white hover:text-green-400"
              >
                My Jobs
              </Link>

              <Link
                to="/applicants"
                className="text-white hover:text-green-400"
              >
                Applicants
              </Link>

              <Link
                to="/company-profile"
                className="text-white hover:text-green-400"
              >
                Profile
              </Link>

            </>

          )}

          {/* ================= Admin ================= */}

          {adminToken && (

            <>

              <Link
                to="/admin-dashboard"
                className="text-white hover:text-red-400"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/students"
                className="text-white hover:text-red-400"
              >
                Students
              </Link>

              <Link
                to="/admin/companies"
                className="text-white hover:text-red-400"
              >
                Companies
              </Link>

              <Link
                to="/admin/jobs"
                className="text-white hover:text-red-400"
              >
                Jobs
              </Link>

              <Link
                to="/admin/applications"
                className="text-white hover:text-red-400"
              >
                Applications
              </Link>

            </>

          )}

          {/* ================= Login/Register ================= */}

          {!studentToken && !companyToken && !adminToken && (

            <>

              <Link
                to="/login"
                className="px-4 py-2 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition"
              >
                Student Login
              </Link>

              <Link
                to="/company-login"
                className="px-4 py-2 rounded-lg border border-green-500 text-green-400 hover:bg-green-500 hover:text-white transition"
              >
                Company Login
              </Link>

              <Link
                to="/admin-login"
                className="px-4 py-2 rounded-lg border border-red-500 text-red-400 hover:bg-red-500 hover:text-white transition"
              >
                Admin Login
              </Link>

            </>

          )}

          {/* Logout */}

          {(studentToken || companyToken || adminToken) && (

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
            >
              Logout
            </button>

          )}

        </div>

      </div>

    </nav>

  );

}

export default Navbar;