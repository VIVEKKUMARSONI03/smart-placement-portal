import { Link } from "react-router-dom";

function Footer() {

  return (

    <footer className="bg-slate-950 border-t border-slate-800 text-white">

      <div className="max-w-7xl mx-auto px-6 py-16">

        <div className="grid md:grid-cols-4 gap-10">

          {/* Logo */}

          <div>

            <h2 className="text-3xl font-bold text-purple-400">

              Smart Placement

            </h2>

            <p className="text-slate-400 mt-5 leading-7">

              AI Powered Placement Portal that connects students
              with top companies and helps them achieve their dream jobs.

            </p>

          </div>

          {/* Quick Links */}

          <div>

            <h3 className="text-xl font-semibold mb-5">

              Quick Links

            </h3>

            <div className="space-y-3">

              <Link
                to="/"
                className="block text-slate-400 hover:text-purple-400"
              >
                Home
              </Link>

              <Link
                to="/jobs"
                className="block text-slate-400 hover:text-purple-400"
              >
                Jobs
              </Link>

              <Link
                to="/login"
                className="block text-slate-400 hover:text-purple-400"
              >
                Student Login
              </Link>

              <Link
                to="/company-login"
                className="block text-slate-400 hover:text-purple-400"
              >
                Company Login
              </Link>

            </div>

          </div>

          {/* AI Features */}

          <div>

            <h3 className="text-xl font-semibold mb-5">

              AI Features

            </h3>

            <div className="space-y-3 text-slate-400">

              <p>🤖 Resume Analyzer</p>

              <p>💼 Job Recommendation</p>

              <p>📊 Placement Analytics</p>

              <p>🚀 Smart Applications</p>

            </div>

          </div>

          {/* Contact */}

          <div>

            <h3 className="text-xl font-semibold mb-5">

              Contact

            </h3>

            <div className="space-y-3 text-slate-400">

              <p>📧 support@smartplacement.com</p>

              <p>📞 +91 9876543210</p>

              <p>📍 India</p>

            </div>

          </div>

        </div>

        <hr className="my-10 border-slate-700" />

        <div className="flex flex-col md:flex-row justify-between items-center">

          <p className="text-slate-500">

            © 2026 Smart Placement Portal. All Rights Reserved.

          </p>

          <div className="flex gap-6 mt-4 md:mt-0">

            <a
              href="#"
              className="hover:text-purple-400"
            >
              Facebook
            </a>

            <a
              href="#"
              className="hover:text-purple-400"
            >
              LinkedIn
            </a>

            <a
              href="#"
              className="hover:text-purple-400"
            >
              GitHub
            </a>

          </div>

        </div>

      </div>

    </footer>

  );

}

export default Footer;