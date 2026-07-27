function Features() {
  const features = [
    {
      title: "AI Resume",
      description: "Upload your resume and improve it with AI suggestions.",
      icon: "📄",
    },
    {
      title: "Easy Apply",
      description: "Apply to multiple companies with a single click.",
      icon: "🚀",
    },
    {
      title: "Top Companies",
      description: "Connect with India's best companies and recruiters.",
      icon: "🏢",
    },
    {
      title: "Placement Analytics",
      description: "Track your applications and placement progress.",
      icon: "📊",
    },
  ];

  return (
    <section className="py-20 bg-[#111827]">
      <div className="max-w-7xl mx-auto px-6">

        <h2 className="text-4xl font-bold text-white text-center mb-12">
          Why Choose Smart Placement Portal?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-[#1E293B] rounded-xl shadow-md p-8 hover:shadow-xl transition"
            >
              <div className="text-5xl mb-4">
                {feature.icon}
              </div>

              <h3 className="text-xl font-bold mb-3">
                {feature.title}
              </h3>

              <p className="text-slate-300">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Features;