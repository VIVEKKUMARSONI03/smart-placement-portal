import { Link } from "react-router-dom";

function Features() {

  const features = [

    {
      icon: "🤖",
      title: "AI Resume Analyzer",
      description:
        "Analyze your resume instantly with AI and improve your ATS score.",
      color: "from-purple-600 to-indigo-600",
      link: "/resume",
    },

    {
      icon: "🚀",
      title: "One Click Apply",
      description:
        "Apply to multiple companies quickly without filling the form again.",
      color: "from-blue-600 to-cyan-600",
      link: "/jobs",
    },

    {
      icon: "🏢",
      title: "Top Companies",
      description:
        "Get opportunities from India's leading startups and MNCs.",
      color: "from-green-600 to-emerald-600",
      link: "/jobs",
    },

    {
      icon: "📊",
      title: "Application Tracking",
      description:
        "Track Pending, Shortlisted, Selected and Rejected applications.",
      color: "from-pink-600 to-rose-600",
      link: "/applications",
    },

    {
      icon: "💡",
      title: "AI Job Recommendation",
      description:
        "Receive personalized job recommendations based on your skills.",
      color: "from-yellow-500 to-orange-500",
      link: "/recommended-jobs",
    },

    {
      icon: "📄",
      title: "Resume Upload",
      description:
        "Upload your resume and keep it available for recruiters anytime.",
      color: "from-violet-600 to-fuchsia-600",
      link: "/resume",
    },

    {
      icon: "👨‍💻",
      title: "Student Dashboard",
      description:
        "Manage your profile, resume, applications and AI tools from one place.",
      color: "from-sky-600 to-blue-700",
      link: "/dashboard",
    },

    {
      icon: "🏆",
      title: "Placement Success",
      description:
        "Improve your placement chances with analytics and smart insights.",
      color: "from-red-600 to-pink-600",
      link: "/dashboard",
    },

  ];

  return (

    <section className="bg-slate-950 py-24">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">

          <h2 className="text-5xl font-bold text-white">
            Why Choose Smart Placement Portal?
          </h2>

          <p className="text-slate-400 mt-5 text-lg">
            Everything you need for placements in one platform.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {features.map((feature) => (

            <Link
              key={feature.title}
              to={feature.link}
              className="bg-slate-800 rounded-2xl p-8 shadow-lg hover:-translate-y-2 hover:shadow-purple-700/30 transition duration-300 block"
            >

              <div
                className={`w-16 h-16 rounded-full bg-gradient-to-r ${feature.color} flex items-center justify-center text-3xl mb-6`}
              >
                {feature.icon}
              </div>

              <h3 className="text-2xl font-bold text-white mb-4">
                {feature.title}
              </h3>

              <p className="text-slate-300 leading-7">
                {feature.description}
              </p>

            </Link>

          ))}

        </div>

      </div>

    </section>

  );

}

export default Features;