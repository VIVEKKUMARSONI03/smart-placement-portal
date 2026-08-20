import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function CompanyProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [uploadingLogo, setUploadingLogo] =
    useState(false);

  const [removingLogo, setRemovingLogo] =
    useState(false);

  const [selectedLogo, setSelectedLogo] =
    useState(null);

  const [preview, setPreview] = useState("");
  const [logoError, setLogoError] =
    useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    website: "",
    location: "",
    description: "",
    logo: "",
  });

  // =====================================
  // Backend URL
  // =====================================

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000";

  // =====================================
  // Get Company Initials
  // =====================================

  const getInitials = (name) => {
    if (!name || !name.trim()) {
      return "CO";
    }

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0]
        .charAt(0)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // =====================================
  // Get Logo URL
  // =====================================

  const getLogoUrl = (logo) => {
    if (!logo) {
      return "";
    }

    if (
      logo.startsWith("http://") ||
      logo.startsWith("https://")
    ) {
      return logo;
    }

    return `${BACKEND_URL}${logo}`;
  };

  // =====================================
  // Load Profile
  // =====================================

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const token =
        localStorage.getItem("companyToken");

      if (!token) {
        toast.error("Company login required");
        return;
      }

      const res = await api.get(
        "/company/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const company = res.data.company;

      setFormData({
        name: company?.name || "",
        email: company?.email || "",
        website: company?.website || "",
        location: company?.location || "",
        description:
          company?.description || "",
        logo: company?.logo || "",
      });

      setLogoError(false);
    } catch (error) {
      console.error(
        "Load Company Profile Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load company profile"
      );
    } finally {
      setLoading(false);
    }
  };

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
  // Select Logo
  // =====================================

  const handleLogoSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Please select JPG, PNG or WEBP image"
      );
      return;
    }

    if (file.size > 3 * 1024 * 1024) {
      toast.error(
        "Company logo must be smaller than 3MB"
      );
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedLogo(file);
    setPreview(previewUrl);
    setLogoError(false);
  };

  // =====================================
  // Upload / Change Logo
  // =====================================

  const handleLogoUpload = async () => {
    if (!selectedLogo) {
      toast.error(
        "Please choose a logo first"
      );
      return;
    }

    try {
      setUploadingLogo(true);

      const token =
        localStorage.getItem("companyToken");

      if (!token) {
        toast.error("Company login required");
        return;
      }

      const logoData = new FormData();

      logoData.append(
        "logo",
        selectedLogo,
        selectedLogo.name
      );

      const response = await fetch(
        "/api/company/logo",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: logoData,
        }
      );

      let data = {};

      try {
        data = await response.json();
      } catch {
        data = {};
      }

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Unable to upload company logo"
        );
      }

      setFormData((previous) => ({
        ...previous,
        logo: data.logo || "",
      }));

      setSelectedLogo(null);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview("");
      setLogoError(false);

      toast.success(
        data.message ||
          "Company logo updated successfully"
      );
    } catch (error) {
      console.error(
        "Company Logo Upload Error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to upload company logo"
      );
    } finally {
      setUploadingLogo(false);
    }
  };

  // =====================================
  // Remove Logo
  // =====================================

  const handleRemoveLogo = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove the company logo?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingLogo(true);

      const token =
        localStorage.getItem("companyToken");

      const res = await api.delete(
        "/company/logo",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview("");
      setSelectedLogo(null);
      setLogoError(false);

      setFormData((previous) => ({
        ...previous,
        logo: "",
      }));

      toast.success(
        res.data.message ||
          "Company logo removed successfully"
      );
    } catch (error) {
      console.error(
        "Remove Company Logo Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to remove company logo"
      );
    } finally {
      setRemovingLogo(false);
    }
  };

  // =====================================
  // Save Company Profile
  // =====================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error(
        "Company name is required"
      );
      return;
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("companyToken");

      const res = await api.put(
        "/company/profile",
        {
          name: formData.name,
          website: formData.website,
          location: formData.location,
          description:
            formData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data.message ||
          "Company profile updated successfully"
      );

      await loadProfile();
    } catch (error) {
      console.error(
        "Update Company Profile Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to update company profile"
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================
  // Loading
  // =====================================

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading Company Profile...
        </p>
      </div>
    );
  }

  const shouldShowLogo =
    !logoError &&
    Boolean(
      preview || formData.logo
    );

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-8">

      <div className="max-w-5xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8">

        {/* =====================================
            Header
        ===================================== */}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7">

          {/* Logo / Initials */}

          <div className="shrink-0">

            {shouldShowLogo ? (
              <img
                src={
                  preview ||
                  getLogoUrl(
                    formData.logo
                  )
                }
                alt="Company Logo"
                onError={() =>
                  setLogoError(true)
                }
                className="w-32 h-32 rounded-full object-cover border-4 border-green-500 bg-white"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-green-500 bg-green-600 flex items-center justify-center">

                <span className="text-white text-4xl font-bold">
                  {getInitials(
                    formData.name
                  )}
                </span>

              </div>
            )}

          </div>

          {/* Company Details */}

          <div className="flex-1 text-center sm:text-left">

            <h1 className="text-4xl font-bold text-white">
              {formData.name ||
                "Company"}
            </h1>

            <p className="text-gray-400 mt-2">
              Company Profile • Manage your
              company information.
            </p>

            {/* Logo Upload */}

            <div className="mt-6">

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={
                  handleLogoSelect
                }
                className="block text-gray-300 text-sm max-w-full"
              />

              <div className="flex flex-wrap gap-3 mt-3">

                {selectedLogo && (
                  <button
                    type="button"
                    onClick={
                      handleLogoUpload
                    }
                    disabled={
                      uploadingLogo
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg"
                  >
                    {uploadingLogo
                      ? "Uploading..."
                      : formData.logo
                      ? "Change Logo"
                      : "Upload Logo"}
                  </button>
                )}

                {formData.logo && (
                  <button
                    type="button"
                    onClick={
                      handleRemoveLogo
                    }
                    disabled={
                      removingLogo
                    }
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg"
                  >
                    {removingLogo
                      ? "Removing..."
                      : "Remove Logo"}
                  </button>
                )}

              </div>

              <p className="text-gray-500 text-sm mt-2">
                JPG, PNG or WEBP. Maximum size 3MB.
              </p>

            </div>

          </div>

        </div>

        {/* Divider */}

        <div className="border-t border-slate-700 my-10" />

        {/* =====================================
            Form
        ===================================== */}

        <form onSubmit={handleSave}>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Company Name */}

            <div>

              <label className="block text-gray-300 mb-2">
                Company Name
              </label>

              <input
                type="text"
                name="name"
                value={
                  formData.name
                }
                onChange={
                  handleChange
                }
                required
                placeholder="Enter company name"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-green-500"
              />

            </div>

            {/* Email */}

            <div>

              <label className="block text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={
                  formData.email
                }
                disabled
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-gray-400 cursor-not-allowed"
              />

              <p className="text-gray-500 text-sm mt-1">
                Email cannot be changed here.
              </p>

            </div>

            {/* Website */}

            <div>

              <label className="block text-gray-300 mb-2">
                Website
              </label>

              <input
                type="url"
                name="website"
                value={
                  formData.website
                }
                onChange={
                  handleChange
                }
                placeholder="https://example.com"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-green-500"
              />

            </div>

            {/* Location */}

            <div>

              <label className="block text-gray-300 mb-2">
                Location
              </label>

              <input
                type="text"
                name="location"
                value={
                  formData.location
                }
                onChange={
                  handleChange
                }
                placeholder="Ranchi, Jharkhand"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-green-500"
              />

            </div>

          </div>

          {/* Description */}

          <div className="mt-6">

            <label className="block text-gray-300 mb-2">
              Company Description
            </label>

            <textarea
              rows="6"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Tell students about your company..."
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white outline-none focus:border-green-500"
            />

          </div>

          {/* Save */}

          <button
            type="submit"
            disabled={saving}
            className="mt-8 bg-green-600 hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-10 py-3 rounded-lg font-semibold"
          >
            {saving
              ? "Saving..."
              : "Save Company Profile"}
          </button>

        </form>

      </div>

    </div>
  );
}

export default CompanyProfile;