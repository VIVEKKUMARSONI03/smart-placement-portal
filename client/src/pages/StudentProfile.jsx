import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function StudentProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [removingImage, setRemovingImage] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [imageError, setImageError] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    branch: "",
    cgpa: "",
    skills: "",
    github: "",
    linkedin: "",
    bio: "",
    profileImage: "",
  });

  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL ||
    "http://localhost:5000";

  // =====================================
  // Get Initials
  // =====================================

  const getInitials = (name) => {
    if (!name || !name.trim()) {
      return "ST";
    }

    const words = name
      .trim()
      .split(/\s+/)
      .filter(Boolean);

    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  };

  // =====================================
  // Build Profile Image URL
  // =====================================

  const getProfileImageUrl = (image) => {
    if (!image) {
      return "";
    }

    if (
      image.startsWith("http://") ||
      image.startsWith("https://")
    ) {
      return image;
    }

    return `${BACKEND_URL}${image}`;
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
        localStorage.getItem("token") ||
        localStorage.getItem("studentToken");

      const res = await api.get(
        "/students/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const student = res.data.student;

      setFormData({
        name: student?.name || "",
        email: student?.email || "",
        phone: student?.phone || "",
        college: student?.college || "",
        branch: student?.branch || "",

        cgpa:
          student?.cgpa === 0 ||
          student?.cgpa
            ? student.cgpa
            : "",

        skills: Array.isArray(student?.skills)
          ? student.skills.join(", ")
          : "",

        github: student?.github || "",
        linkedin: student?.linkedin || "",
        bio: student?.bio || "",
        profileImage:
          student?.profileImage || "",
      });

      setImageError(false);
    } catch (error) {
      console.error(
        "Load Profile Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to load profile"
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

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================
  // Select Profile Image
  // =====================================

  const handleImageSelect = (e) => {
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
        "Profile picture must be smaller than 3MB"
      );
      return;
    }

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const previewUrl =
      URL.createObjectURL(file);

    setSelectedImage(file);
    setPreview(previewUrl);
    setImageError(false);
  };

  // =====================================
  // Upload / Change Profile Photo
  // =====================================

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error(
        "Please choose an image first"
      );
      return;
    }

    try {
      setUploadingImage(true);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("studentToken");

      if (!token) {
        toast.error("Please login again");
        return;
      }

      const imageData = new FormData();

      imageData.append(
        "profileImage",
        selectedImage,
        selectedImage.name
      );

      const response = await fetch(
        "/api/students/profile-image",
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: imageData,
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
            "Unable to upload profile picture"
        );
      }

      setFormData((prev) => ({
        ...prev,
        profileImage:
          data.profileImage || "",
      }));

      setSelectedImage(null);

      if (preview) {
        URL.revokeObjectURL(preview);
      }

      setPreview("");
      setImageError(false);

      toast.success(
        data.message ||
          "Profile picture updated successfully"
      );
    } catch (error) {
      console.error(
        "Profile Image Upload Error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to upload profile picture"
      );
    } finally {
      setUploadingImage(false);
    }
  };

  // =====================================
  // Remove Profile Photo
  // =====================================

  const handleRemoveImage = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to remove your profile picture?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingImage(true);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("studentToken");

      const res = await api.delete(
        "/students/profile-image",
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
      setSelectedImage(null);
      setImageError(false);

      setFormData((prev) => ({
        ...prev,
        profileImage: "",
      }));

      toast.success(
        res.data.message ||
          "Profile picture removed successfully"
      );
    } catch (error) {
      console.error(
        "Remove Profile Image Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Unable to remove profile picture"
      );
    } finally {
      setRemovingImage(false);
    }
  };

  // =====================================
  // Save Profile
  // =====================================

  const handleSave = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (formData.cgpa !== "") {
      const cgpa = Number(formData.cgpa);

      if (
        Number.isNaN(cgpa) ||
        cgpa < 0 ||
        cgpa > 10
      ) {
        toast.error(
          "CGPA must be between 0 and 10"
        );
        return;
      }
    }

    try {
      setSaving(true);

      const token =
        localStorage.getItem("token") ||
        localStorage.getItem("studentToken");

      const skills = formData.skills
        .split(",")
        .map((skill) => skill.trim())
        .filter(Boolean);

      const res = await api.put(
        "/students/profile",
        {
          name: formData.name,
          phone: formData.phone,
          college: formData.college,
          branch: formData.branch,
          cgpa: formData.cgpa,
          skills,
          github: formData.github,
          linkedin: formData.linkedin,
          bio: formData.bio,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(
        res.data.message ||
          "Profile updated successfully"
      );

      await loadProfile();
    } catch (error) {
      console.error(
        "Profile Update Error:",
        error
      );

      toast.error(
        error.response?.data?.message ||
          "Profile update failed"
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
          Loading Profile...
        </p>
      </div>
    );
  }

  const shouldShowImage =
    !imageError &&
    Boolean(
      preview || formData.profileImage
    );

  // =====================================
  // UI
  // =====================================

  return (
    <div className="min-h-screen bg-slate-900 p-6 md:p-8">
      <div className="max-w-5xl mx-auto bg-slate-800 border border-slate-700 rounded-2xl p-6 md:p-8">

        {/* Profile Header */}

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-7">

          {/* Avatar */}

          <div className="shrink-0">
            {shouldShowImage ? (
              <img
                src={
                  preview ||
                  getProfileImageUrl(
                    formData.profileImage
                  )
                }
                alt="Profile"
                onError={() =>
                  setImageError(true)
                }
                className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-purple-500 bg-purple-600 flex items-center justify-center">
                <span className="text-white text-4xl font-bold">
                  {getInitials(
                    formData.name
                  )}
                </span>
              </div>
            )}
          </div>

          {/* Name + Image Controls */}

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-4xl font-bold text-white">
              {formData.name ||
                "Student"}
            </h1>

            <p className="text-gray-400 mt-2">
              Student Profile • Update your personal
              and academic information.
            </p>

            <div className="mt-6">
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageSelect}
                className="block text-gray-300 text-sm max-w-full"
              />

              <div className="flex flex-wrap gap-3 mt-3">

                {selectedImage && (
                  <button
                    type="button"
                    onClick={
                      handleImageUpload
                    }
                    disabled={
                      uploadingImage
                    }
                    className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg"
                  >
                    {uploadingImage
                      ? "Uploading..."
                      : formData.profileImage
                      ? "Change Photo"
                      : "Upload Photo"}
                  </button>
                )}

                {formData.profileImage && (
                  <button
                    type="button"
                    onClick={
                      handleRemoveImage
                    }
                    disabled={
                      removingImage
                    }
                    className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-5 py-2 rounded-lg"
                  >
                    {removingImage
                      ? "Removing..."
                      : "Remove Photo"}
                  </button>
                )}

              </div>

              <p className="text-gray-500 text-sm mt-2">
                JPG, PNG or WEBP. Maximum size 3MB.
              </p>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-700 my-10" />

        {/* Form */}

        <form onSubmit={handleSave}>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <label className="block text-gray-300 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Email
              </label>

              <input
                type="email"
                value={formData.email}
                disabled
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-gray-400 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Phone
              </label>

              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                College
              </label>

              <input
                type="text"
                name="college"
                value={formData.college}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                Branch
              </label>

              <input
                type="text"
                name="branch"
                value={formData.branch}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                CGPA
              </label>

              <input
                type="number"
                min="0"
                max="10"
                step="0.01"
                name="cgpa"
                value={formData.cgpa}
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                GitHub
              </label>

              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/username"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">
                LinkedIn
              </label>

              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
              />
            </div>

          </div>

          <div className="mt-6">
            <label className="block text-gray-300 mb-2">
              Skills
            </label>

            <textarea
              rows="3"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              placeholder="React, Node, MongoDB, JavaScript"
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
            />
          </div>

          <div className="mt-6">
            <label className="block text-gray-300 mb-2">
              Bio
            </label>

            <textarea
              rows="5"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell companies something about yourself..."
              className="w-full p-3 rounded-lg bg-slate-700 border border-slate-600 text-white"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-8 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-10 py-3 rounded-lg font-semibold"
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </form>

      </div>
    </div>
  );
}

export default StudentProfile;