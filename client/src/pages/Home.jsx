import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const [action, setAction] = useState("");
  const [role, setRole] = useState("");

  // =====================================
  // Continue
  // =====================================

  const handleContinue = () => {
    if (!action || !role) {
      return;
    }

    // Student
    if (role === "student") {
      if (action === "login") {
        navigate("/login");
      } else {
        navigate("/register");
      }

      return;
    }

    // Company
    if (role === "company") {
      if (action === "login") {
        navigate("/company-login");
      } else {
        navigate("/company-register");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-center p-5">

      <div className="w-full max-w-5xl">

        {/* =====================================
            Brand
        ===================================== */}

        <div className="text-center mb-10">

          <h1 className="text-4xl md:text-6xl font-extrabold">
            Smart{" "}
            <span className="text-purple-400">
              Placement
            </span>
          </h1>

          <p className="text-slate-400 mt-4 text-lg">
            AI Powered Placement & Recruitment Portal
          </p>

        </div>

        {/* =====================================
            Main Card
        ===================================== */}

        <div className="bg-slate-900/80 backdrop-blur border border-slate-700 rounded-3xl shadow-2xl p-6 md:p-10">

          <div className="text-center">

            <h2 className="text-3xl font-bold">
              Welcome 👋
            </h2>

            <p className="text-slate-400 mt-2">
              Login or create an account to continue.
            </p>

          </div>

          {/* =====================================
              Login / Register
          ===================================== */}

          <div className="mt-10">

            <h3 className="text-lg font-semibold text-slate-300 text-center mb-5">
              What do you want to do?
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">

              {/* Login */}

              <button
                type="button"
                onClick={() => setAction("login")}
                className={`rounded-2xl border-2 p-6 transition-all duration-200 ${
                  action === "login"
                    ? "border-purple-500 bg-purple-600/20 scale-[1.02]"
                    : "border-slate-700 bg-slate-800 hover:border-purple-500"
                }`}
              >
                <div className="text-4xl">
                  🔐
                </div>

                <h4 className="text-2xl font-bold mt-3">
                  Login
                </h4>

                <p className="text-slate-400 mt-2">
                  Already have an account?
                </p>
              </button>

              {/* Register */}

              <button
                type="button"
                onClick={() => setAction("register")}
                className={`rounded-2xl border-2 p-6 transition-all duration-200 ${
                  action === "register"
                    ? "border-cyan-500 bg-cyan-600/20 scale-[1.02]"
                    : "border-slate-700 bg-slate-800 hover:border-cyan-500"
                }`}
              >
                <div className="text-4xl">
                  ✨
                </div>

                <h4 className="text-2xl font-bold mt-3">
                  Register
                </h4>

                <p className="text-slate-400 mt-2">
                  Create a new account.
                </p>
              </button>

            </div>

          </div>

          {/* =====================================
              Select Role
          ===================================== */}

          <div className="mt-10">

            <h3 className="text-lg font-semibold text-slate-300 text-center mb-5">
              Select Account Type
            </h3>

            <div className="grid sm:grid-cols-2 gap-5">

              {/* Student */}

              <button
                type="button"
                onClick={() => setRole("student")}
                className={`rounded-2xl border-2 p-6 transition-all duration-200 ${
                  role === "student"
                    ? "border-blue-500 bg-blue-600/20 scale-[1.02]"
                    : "border-slate-700 bg-slate-800 hover:border-blue-500"
                }`}
              >
                <div className="text-5xl">
                  🎓
                </div>

                <h4 className="text-2xl font-bold mt-3">
                  Student
                </h4>

                <p className="text-slate-400 mt-2">
                  Find jobs, analyze resume and track
                  applications.
                </p>
              </button>

              {/* Company */}

              <button
                type="button"
                onClick={() => setRole("company")}
                className={`rounded-2xl border-2 p-6 transition-all duration-200 ${
                  role === "company"
                    ? "border-green-500 bg-green-600/20 scale-[1.02]"
                    : "border-slate-700 bg-slate-800 hover:border-green-500"
                }`}
              >
                <div className="text-5xl">
                  🏢
                </div>

                <h4 className="text-2xl font-bold mt-3">
                  Company
                </h4>

                <p className="text-slate-400 mt-2">
                  Post jobs and manage applicants.
                </p>
              </button>

            </div>

          </div>

          {/* =====================================
              Selected Information
          ===================================== */}

          {(action || role) && (
            <div className="mt-8 text-center">

              <p className="text-slate-400">
                Selected:
                <span className="text-white font-semibold ml-2 capitalize">
                  {action || "Choose Login/Register"}
                </span>

                <span className="mx-2">
                  •
                </span>

                <span className="text-white font-semibold capitalize">
                  {role || "Choose Account Type"}
                </span>
              </p>

            </div>
          )}

          {/* =====================================
              Continue
          ===================================== */}

          <button
            type="button"
            onClick={handleContinue}
            disabled={!action || !role}
            className="mt-8 w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-lg font-bold py-4 rounded-xl transition"
          >
            Continue →
          </button>

          {/* =====================================
              Examples
          ===================================== */}

          {!action || !role ? (
            <p className="text-center text-slate-500 text-sm mt-4">
              Select both options to continue.
            </p>
          ) : null}

          {/* =====================================
              Admin
          ===================================== */}

          <div className="border-t border-slate-700 mt-10 pt-7 text-center">

            <p className="text-slate-400 mb-3">
              Portal Administrator?
            </p>

            <button
              type="button"
              onClick={() => navigate("/admin-login")}
              className="border border-red-500 text-red-400 hover:bg-red-600 hover:text-white px-7 py-3 rounded-xl transition"
            >
              🛡️ Admin Login
            </button>

          </div>

        </div>

        {/* Footer Text */}

        <p className="text-center text-slate-500 text-sm mt-6">
          Smart Placement Portal • AI Powered Career Platform
        </p>

      </div>

    </div>
  );
}

export default Home;