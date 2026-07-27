function Stats() {
  return (
    <section className="py-16 bg-white">

      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

        <div>
          <h2 className="text-4xl font-bold text-blue-600">500+</h2>
          <p className="text-gray-600 mt-2">Students</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-blue-600">100+</h2>
          <p className="text-gray-600 mt-2">Companies</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-blue-600">1000+</h2>
          <p className="text-gray-600 mt-2">Jobs</p>
        </div>

        <div>
          <h2 className="text-4xl font-bold text-blue-600">95%</h2>
          <p className="text-gray-600 mt-2">Placement Rate</p>
        </div>

      </div>

    </section>
  );
}

export default Stats;