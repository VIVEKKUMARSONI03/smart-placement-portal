import {
  LayoutDashboard,
  PlusCircle,
  Briefcase,
  Users,
  User,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function CompanySidebar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("companyToken");
    navigate("/company-login");
  };

  const menu = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-purple-600 text-white"
        : "text-gray-300 hover:bg-slate-700"
    }`;

  return (
    <div className="w-64 min-h-screen bg-slate-800 border-r border-slate-700 p-6">

      <h1 className="text-2xl font-bold text-purple-400 mb-10">
        Company Panel
      </h1>

      <div className="space-y-3">

        <NavLink to="/company-dashboard" className={menu}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/create-job" className={menu}>
          <PlusCircle size={20} />
          Create Job
        </NavLink>

        <NavLink to="/my-jobs" className={menu}>
          <Briefcase size={20} />
          My Jobs
        </NavLink>

        <NavLink to="/applicants" className={menu}>
          <Users size={20} />
          Applicants
        </NavLink>

        <NavLink to="/company-profile" className={menu}>
          <User size={20} />
          Company Profile
        </NavLink>

      </div>

      <button
        onClick={logout}
        className="mt-10 w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg text-white flex items-center justify-center gap-2"
      >
        <LogOut size={20} />
        Logout
      </button>

    </div>
  );
}

export default CompanySidebar;
