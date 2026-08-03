function DashboardCard({ title, value, color }) {
  return (
    <div
      className={`rounded-xl p-6 shadow-lg ${color} hover:scale-105 transition duration-300`}
    >
      <h3 className="text-lg font-medium text-white">
        {title}
      </h3>

      <h1 className="text-4xl font-bold mt-3 text-white">
        {value}
      </h1>
    </div>
  );
}

export default DashboardCard;