import { useState, useContext } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { loginStudent } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function Login() {

  const navigate = useNavigate();

  const { setStudent } = useContext(AuthContext);

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
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

      const data = await loginStudent(formData);

      console.log("LOGIN RESPONSE:", data);

      // Save Token
      localStorage.setItem("token", data.token);

      // Save Role
      localStorage.setItem("role", "student");

      // Save Logged-in Student
      setStudent(data.student);

      toast.success(data.message);

      // Go to Dashboard
      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      toast.error(
        error.response?.data?.message ||
        error.message ||
        "Login Failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-[#1E293B] rounded-2xl shadow-2xl border border-slate-700 p-8">

        <h1 className="text-3xl font-bold text-center text-purple-400">
          Student Login
        </h1>

        <p className="text-center text-slate-300 mt-2">
          Welcome Back 👋
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">

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
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-11 pr-4 py-3 text-white outline-none focus:border-purple-500"
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
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                className="w-full bg-slate-800 border border-slate-600 rounded-lg pl-11 pr-12 py-3 text-white outline-none focus:border-purple-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400"
              >

                {showPassword ? (
                  <EyeOff size={20} />
                ) : (
                  <Eye size={20} />
                )}

              </button>

            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 transition rounded-lg py-3 font-semibold text-white"
          >

            {loading ? "Logging In..." : "Login"}

          </button>

        </form>

      </div>

    </div>

  );

}

export default Login;