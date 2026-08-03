import {
  LayoutDashboard,
  User,
  FileText,
  Briefcase,
  ClipboardList,
  Settings,
  LogOut,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const menuClass = ({ isActive }) =>
    `flex items-center gap-3 w-full px-4 py-3 rounded-lg transition ${
      isActive
        ? "bg-purple-600 text-white"
        : "hover:bg-slate-700 text-slate-300"
    }`;

  return (
    <div className="w-64 min-h-screen bg-[#1E293B] border-r border-slate-700 p-6">

      <h1 className="text-2xl font-bold text-purple-400 mb-10">
        Smart Placement
      </h1>

      <nav className="space-y-3">

        <NavLink to="/dashboard" className={menuClass}>
          <LayoutDashboard size={20} />
          Dashboard
        </NavLink>

        <NavLink to="/profile" className={menuClass}>
          <User size={20} />
          My Profile
        </NavLink>

        <NavLink to="/resume" className={menuClass}>
          <FileText size={20} />
          Resume
        </NavLink>

        <NavLink to="/jobs" className={menuClass}>
          <Briefcase size={20} />
          Jobs
        </NavLink>

        <NavLink to="/applications" className={menuClass}>
          <ClipboardList size={20} />
          Applications
        </NavLink>

        <NavLink to="/settings" className={menuClass}>
          <Settings size={20} />
          Settings
        </NavLink>

      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 mt-12 w-full px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
      >
        <LogOut size={20} />
        Logout
      </button>

    </div>
  );
}

export default Sidebar;