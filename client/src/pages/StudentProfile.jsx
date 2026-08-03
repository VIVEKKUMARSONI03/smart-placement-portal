import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../services/api";

function StudentProfile() {

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

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

  useEffect(() => {

    loadProfile();

  }, []);

  // ==========================
  // Load Student Profile
  // ==========================

  const loadProfile = async () => {

    try {

      const token = localStorage.getItem("token");

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

        name: student.name || "",

        email: student.email || "",

        phone: student.phone || "",

        college: student.college || "",

        branch: student.branch || "",

        cgpa: student.cgpa || "",

        skills: Array.isArray(student.skills)
          ? student.skills.join(", ")
          : "",

        github: student.github || "",

        linkedin: student.linkedin || "",

        bio: student.bio || "",

        profileImage: student.profileImage || "",

      });

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Unable to load profile"
      );

    } finally {

      setLoading(false);

    }

  };

  // ==========================
  // Handle Input
  // ==========================

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]: e.target.value,

    });

  };

  // ==========================
  // Save Profile
  // ==========================

  const handleSave = async () => {

    try {

      setSaving(true);

      const token = localStorage.getItem("token");

      await api.put(

        "/students/profile",

        {

          ...formData,

          skills: formData.skills
            .split(",")
            .map((s) => s.trim()),

        },

        {

          headers: {

            Authorization: `Bearer ${token}`,

          },

        }

      );

      toast.success("Profile Updated Successfully");

    } catch (error) {

      toast.error(
        error.response?.data?.message ||
        "Profile Update Failed"
      );

    } finally {

      setSaving(false);

    }

  };
    // ==========================
  // Loading Screen
  // ==========================

  if (loading) {

    return (

      <div className="min-h-screen flex items-center justify-center bg-slate-900">

        <h1 className="text-white text-2xl">

          Loading Profile...

        </h1>

      </div>

    );

  }

  return (

    <div className="min-h-screen bg-slate-900 p-8">

      <div className="max-w-5xl mx-auto bg-slate-800 rounded-xl shadow-xl p-8">

        <div className="flex items-center gap-6">

          <img
            src={
              formData.profileImage ||
              "https://ui-avatars.com/api/?name=Student&background=7C3AED&color=fff"
            }
            alt="Profile"
            className="w-28 h-28 rounded-full border-4 border-purple-500"
          />

          <div>

            <h1 className="text-4xl font-bold text-white">

              Student Profile

            </h1>

            <p className="text-gray-400 mt-2">

              Update your profile information

            </p>

          </div>

        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-10">

          <div>

            <label className="text-gray-300">

              Full Name

            </label>

            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-white"
            />

          </div>

          <div>

            <label className="text-gray-300">

              Email

            </label>

            <input
              type="email"
              value={formData.email}
              disabled
              className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-gray-400"
            />

          </div>

          <div>

            <label className="text-gray-300">

              Phone

            </label>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-white"
            />

          </div>

          <div>

            <label className="text-gray-300">

              College

            </label>

            <input
              type="text"
              name="college"
              value={formData.college}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-white"
            />

          </div>

          <div>

            <label className="text-gray-300">

              Branch

            </label>

            <input
              type="text"
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-white"
            />

          </div>

          <div>

            <label className="text-gray-300">

              CGPA

            </label>

            <input
              type="number"
              step="0.01"
              name="cgpa"
              value={formData.cgpa}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-white"
            />

          </div>

          <div>

            <label className="text-gray-300">

              GitHub

            </label>

            <input
              type="text"
              name="github"
              value={formData.github}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-white"
            />

          </div>

          <div>

            <label className="text-gray-300">

              LinkedIn

            </label>

            <input
              type="text"
              name="linkedin"
              value={formData.linkedin}
              onChange={handleChange}
              className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-white"
            />

          </div>

        </div>

        <div className="mt-6">

          <label className="text-gray-300">

            Skills (Comma Separated)

          </label>

          <textarea
            rows="3"
            name="skills"
            value={formData.skills}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-white"
          />

        </div>

        <div className="mt-6">

          <label className="text-gray-300">

            Bio

          </label>

          <textarea
            rows="5"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-lg bg-slate-700 text-white"
          />

        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="mt-8 bg-purple-600 hover:bg-purple-700 px-10 py-3 rounded-lg text-white font-semibold"
        >

          {

            saving
              ? "Saving..."
              : "Save Profile"

          }

        </button>

      </div>

    </div>

  );

}

export default StudentProfile;