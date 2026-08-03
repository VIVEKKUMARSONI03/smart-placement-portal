import { useState } from "react";
import { User, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { registerStudent } from "../services/authService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const data = await registerStudent(formData);

      toast.success(data.message);

      navigate("/login");
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        "Registration Failed. Please make sure the backend is running.";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#1E293B] rounded-2xl border border-slate-700 shadow-2xl p-8">

        <h1 className="text-3xl font-bold text-center text-purple-400">
          Create Account
        </h1>

        <p className="text-center text-slate-300 mt-2">
          Join Smart Placement Portal 🚀
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

          <div>

            <label className="block text-slate-300 mb-2">
              Full Name
            </label>

            <div className="relative">

              <User
                size={20}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter Full Name"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-11 py-3 pr-4 text-white outline-none focus:border-purple-500"
                required
              />

            </div>

          </div>

          <div>

            <label className="block text-slate-300 mb-2">
              Email
            </label>

            <div className="relative">

              <Mail
                size={20}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-11 py-3 pr-4 text-white outline-none focus:border-purple-500"
                required
              />

            </div>

          </div>

          <div>

            <label className="block text-slate-300 mb-2">
              Password
            </label>

            <div className="relative">

              <Lock
                size={20}
                className="absolute left-3 top-3.5 text-slate-400"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-11 py-3 pr-12 text-white outline-none focus:border-purple-500"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-lg py-3 font-semibold text-white"
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default Register;