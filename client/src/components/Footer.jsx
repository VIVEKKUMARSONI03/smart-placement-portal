function Footer() {
  return (
    <footer className="bg-black text-white py-10">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-2xl font-bold">
          Smart Placement Portal
        </h2>

        <p className="mt-3 text-gray-400">
          Connecting Students with Top Companies.
        </p>

        <div className="mt-6 flex justify-center gap-8">
          <a href="#" className="hover:text-blue-400">Home</a>
          <a href="#" className="hover:text-blue-400">Jobs</a>
          <a href="#" className="hover:text-blue-400">Companies</a>
          <a href="#" className="hover:text-blue-400">About</a>
        </div>

        <hr className="my-6 border-gray-700" />

        <p className="text-gray-500">
          © 2026 Smart Placement Portal. All Rights Reserved.
        </p>

      </div>
    </footer>
  );
}

export default Footer;