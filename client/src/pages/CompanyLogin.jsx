import { useState, useContext } from "react";
import { CompanyAuthContext } from "../context/CompanyAuthContext";
import { loginCompany } from "../services/companyAuthService";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function CompanyLogin() {

  const navigate = useNavigate();

  const { setCompany } = useContext(CompanyAuthContext);

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

      const data = await loginCompany(formData);

      localStorage.setItem("companyToken", data.token);
          localStorage.setItem("role", "company");
      setCompany(data.company);

      toast.success(data.message);

      navigate("/company-dashboard");

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
        className="bg-slate-800 p-8 rounded-xl w-[450px] space-y-5"
      >

        <h1 className="text-3xl text-white font-bold">
          Company Login
        </h1>

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

        <button className="w-full bg-purple-600 py-3 rounded text-white">
          Login
        </button>

      </form>

    </div>
  );
}

export default CompanyLogin;