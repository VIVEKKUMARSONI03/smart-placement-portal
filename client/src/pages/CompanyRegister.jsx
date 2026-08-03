import { useState } from "react";
import { registerCompany } from "../services/companyAuthService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CompanyRegister() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    website: "",
    location: "",
    description: "",
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
      const data = await registerCompany(formData);

      toast.success(data.message);

      navigate("/company-login");

    } catch (error) {
      toast.error(
        error.response?.data?.message || "Registration Failed"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900">

      <form
        onSubmit={handleSubmit}
        className="bg-slate-800 p-8 rounded-xl w-[500px] space-y-4"
      >

        <h1 className="text-3xl text-white font-bold">
          Company Register
        </h1>

        <input
          name="name"
          placeholder="Company Name"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-700 text-white"
        />

        <input
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

        <input
          name="website"
          placeholder="Website"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-700 text-white"
        />

        <input
          name="location"
          placeholder="Location"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-700 text-white"
        />

        <textarea
          rows="4"
          name="description"
          placeholder="Description"
          onChange={handleChange}
          className="w-full p-3 rounded bg-slate-700 text-white"
        />

        <button className="w-full bg-purple-600 py-3 rounded text-white">
          Register
        </button>

      </form>

    </div>
  );
}

export default CompanyRegister;