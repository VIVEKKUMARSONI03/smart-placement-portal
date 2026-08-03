function CompanyCard({ title, value, color }) {
  return (
    <div className={`${color} rounded-xl p-6 shadow-lg`}>

      <h2 className="text-lg text-white">
        {title}
      </h2>

      <p className="text-4xl font-bold text-white mt-3">
        {value}
      </p>

    </div>
  );
}

export default CompanyCard;