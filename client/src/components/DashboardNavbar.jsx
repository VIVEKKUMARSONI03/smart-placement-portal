import { Bell, Search } from "lucide-react";

function DashboardNavbar() {
  return (
    <div className="flex items-center justify-between bg-[#1E293B] border-b border-slate-700 px-8 py-5">

      <div>
        <h2 className="text-2xl font-bold text-white">
          Welcome Back 👋
        </h2>

        <p className="text-slate-400">
          Ready for your next placement?
        </p>
      </div>

      <div className="flex items-center gap-5">

        <div className="relative">

          <Search
            size={18}
            className="absolute left-3 top-3 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search..."
            className="bg-slate-800 text-white pl-10 pr-4 py-2 rounded-lg outline-none border border-slate-600 focus:border-purple-500"
          />

        </div>

        <button className="relative">

          <Bell
            size={24}
            className="text-slate-300 hover:text-white"
          />

          <span className="absolute -top-1 -right-1 bg-red-500 text-xs rounded-full px-1">
            3
          </span>

        </button>

        <img
          src="https://i.pravatar.cc/40"
          alt="Profile"
          className="w-10 h-10 rounded-full border-2 border-purple-500"
        />

      </div>

    </div>
  );
}

export default DashboardNavbar;