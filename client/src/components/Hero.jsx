import hero from "../assets/hero.png";

function Hero() {
  return (
    <section className="bg-gradient-to-r from-[#0F172A] via-[#1E1B4B] to-[#312E81] text-white">
      <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 items-center gap-12">

        {/* Left Side */}
        <div>

          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Find Your
            <span className="text-cyan-400"> Dream Job </span>
            Faster 🚀
          </h1>

          <p className="mt-6 text-lg text-slate-300">
            Upload your resume, apply to top companies, track your
            applications and get placed with ease.
          </p>

          <div className="mt-8 flex gap-4">

            <button className="bg-purple-600 text-white hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
              Get Started
            </button>

            <button className="border border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black px-6 py-3 rounded-lg hover:bg-white hover:text-blue-700 transition">
              Explore Jobs
            </button>

          </div>

        </div>

        {/* Right Side */}

        <div className="flex justify-center">
          <img
            src={hero}
            alt="Hero"
            className="w-full max-w-md"
          />
        </div>

      </div>
    </section>
  );
}

export default Hero;