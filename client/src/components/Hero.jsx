import { Link } from "react-router-dom";
import hero from "../assets/hero.png";

function Hero() {
  return (
    <section className="bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 text-white overflow-hidden">

      <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">

        {/* Left */}

        <div>

          <span className="inline-block bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-sm mb-6 border border-purple-500">
            🚀 AI Powered Placement Portal
          </span>

          <h1 className="text-5xl lg:text-6xl font-extrabold leading-tight">

            Build Your

            <span className="text-cyan-400">
              {" "}Dream Career{" "}
            </span>

            With Smart Placement

          </h1>

          <p className="mt-8 text-slate-300 text-lg leading-8">

            Find internships and jobs, analyze your resume with AI,
            receive smart job recommendations and manage every
            application from one powerful dashboard.

          </p>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              to="/register"
              className="bg-purple-600 hover:bg-purple-700 px-8 py-4 rounded-xl font-semibold transition shadow-lg"
            >
              Get Started
            </Link>

            <Link
              to="/jobs"
              className="border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-8 py-4 rounded-xl font-semibold transition"
            >
              Browse Jobs
            </Link>

          </div>

          <div className="mt-12 flex gap-10">

            <div>
              <h2 className="text-3xl font-bold text-cyan-400">
                1000+
              </h2>

              <p className="text-slate-400">
                Active Jobs
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-green-400">
                500+
              </h2>

              <p className="text-slate-400">
                Companies
              </p>
            </div>

            <div>
              <h2 className="text-3xl font-bold text-yellow-400">
                AI
              </h2>

              <p className="text-slate-400">
                Resume Analyzer
              </p>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="flex justify-center">

          <img
            src={hero}
            alt="Hero"
            className="w-full max-w-lg drop-shadow-2xl hover:scale-105 transition duration-500"
          />

        </div>

      </div>

    </section>
  );
}

export default Hero;