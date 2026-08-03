import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { loginAdmin } from "../services/adminAuthService";

function AdminLogin() {

  const navigate = useNavigate();

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

      const data = await loginAdmin(formData);

      // Save Admin Token
      localStorage.setItem("adminToken", data.token);

      // Save Role
      localStorage.setItem("role", "admin");

      toast.success(data.message);

      navigate("/admin-dashboard");

    } catch (error) {

      toast.error(
        error.response?.data?.message || "Login Failed"
      );

    }

  };

  return (

    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-[420px] space-y-5"
      >

        <h1 className="text-3xl font-bold text-white">
          Admin Login
        </h1>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-700 text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-700 text-white"
        />

        <button className="w-full bg-purple-600 py-3 rounded text-white">

          Login

        </button>

      </form>

    </div>

  );

}

export default AdminLogin;