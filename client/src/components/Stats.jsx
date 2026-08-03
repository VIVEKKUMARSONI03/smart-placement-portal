function Stats() {

  const stats = [
    {
      number: "500+",
      title: "Students",
      color: "text-cyan-400",
    },
    {
      number: "100+",
      title: "Companies",
      color: "text-green-400",
    },
    {
      number: "1000+",
      title: "Jobs",
      color: "text-purple-400",
    },
    {
      number: "95%",
      title: "Placement Rate",
      color: "text-yellow-400",
    },
  ];

  return (

    <section className="bg-slate-900 py-20">

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-14">

          <h2 className="text-4xl font-bold text-white">

            Platform Statistics

          </h2>

          <p className="text-slate-400 mt-3">

            Trusted by hundreds of students and companies.

          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

          {stats.map((item) => (

            <div
              key={item.title}
              className="bg-slate-800 rounded-2xl p-8 text-center shadow-lg hover:-translate-y-2 hover:shadow-purple-700/30 transition duration-300"
            >

              <h1 className={`text-5xl font-bold ${item.color}`}>

                {item.number}

              </h1>

              <p className="text-slate-300 text-lg mt-4">

                {item.title}

              </p>

            </div>

          ))}

        </div>

      </div>

    </section>

  );

}

export default Stats;