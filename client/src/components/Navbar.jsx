import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-[#0F172A] shadow-lg border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="text-2xl font-bold text-purple-400"
        >
          Smart Placement
        </Link>

        {/* Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-300 hover:text-cyan-400 transition">
            Home
          </Link>

          <Link to="/jobs" className="text-gray-300 hover:text-cyan-400 transition">
            Jobs
          </Link>

          <Link to="/companies" className="text-gray-300 hover:text-cyan-400 transition">
            Companies
          </Link>

          <Link to="/about" className="text-gray-300 hover:text-cyan-400 transition ">
            About
          </Link>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <Link
            to="/login"
            className="px-4 py-2 rounded-lg border border-purple-500 text-purple-400 hover:bg-purple-500 hover:text-white transition"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white hover:bg-blue-700"
            
          >
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;