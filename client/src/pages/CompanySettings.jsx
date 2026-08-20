import { useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function CompanySettings() {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);

  // =====================================
  // Input Change
  // =====================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =====================================
  // Change Password
  // =====================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      currentPassword,
      newPassword,
      confirmPassword,
    } = formData;

    if (
      !currentPassword ||
      !newPassword ||
      !confirmPassword
    ) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword.length < 6) {
      toast.error(
        "New password must be at least 6 characters"
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error(
        "New password and confirm password do not match"
      );
      return;
    }

    if (currentPassword === newPassword) {
      toast.error(
        "New password must be different from current password"
      );
      return;
    }

    try {
      setLoading(true);

      const token =
        localStorage.getItem("companyToken");

      if (!token) {
        toast.error("Company login required");
        return;
      }

      const res = await api.put(
        "/company/change-password",
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data.message ||
          "Password changed successfully"
      );

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error(
        "Company Change Password Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to change password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            ⚙️ Company Settings
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your company account settings
            and password.
          </p>
        </div>

        {/* Change Password Card */}

        <div className="bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white">
            🔐 Change Password
          </h2>

          <p className="text-slate-400 mt-2">
            Enter your current password and choose
            a new password.
          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-8 space-y-6"
          >
            {/* Current Password */}

            <div>
              <label className="block text-slate-300 mb-2">
                Current Password
              </label>

              <input
                type="password"
                name="currentPassword"
                value={formData.currentPassword}
                onChange={handleChange}
                placeholder="Enter current password"
                autoComplete="current-password"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* New Password */}

            <div>
              <label className="block text-slate-300 mb-2">
                New Password
              </label>

              <input
                type="password"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter new password"
                autoComplete="new-password"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-purple-500"
              />

              <p className="text-slate-500 text-sm mt-2">
                Password must contain at least 6
                characters.
              </p>
            </div>

            {/* Confirm Password */}

            <div>
              <label className="block text-slate-300 mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                autoComplete="new-password"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-purple-500"
              />
            </div>

            {/* Submit */}

            <button
              type="submit"
              disabled={loading}
              className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold"
            >
              {loading
                ? "Changing Password..."
                : "Change Password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CompanySettings;