import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = [
  "#6366F1",
  "#22C55E",
  "#F59E0B",
  "#EF4444",
];

function DashboardCharts({ analytics }) {

  const barData = [
    {
      name: "Students",
      value: analytics.counts.students,
    },
    {
      name: "Companies",
      value: analytics.counts.companies,
    },
    {
      name: "Jobs",
      value: analytics.counts.jobs,
    },
    {
      name: "Applications",
      value: analytics.counts.applications,
    },
  ];

  return (

    <div className="grid lg:grid-cols-2 gap-8 mt-12">

      <div className="bg-slate-800 rounded-xl p-6">

        <h2 className="text-white text-xl mb-6">

          Overall Statistics

        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <BarChart data={barData}>

            <XAxis dataKey="name"/>

            <YAxis/>

            <Tooltip/>

            <Bar dataKey="value"/>

          </BarChart>

        </ResponsiveContainer>

      </div>

      <div className="bg-slate-800 rounded-xl p-6">

        <h2 className="text-white text-xl mb-6">

          Application Status

        </h2>

        <ResponsiveContainer
          width="100%"
          height={300}
        >

          <PieChart>

            <Pie
              data={analytics.statusData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >

              {analytics.statusData.map(
                (entry, index) => (

                  <Cell
                    key={index}
                    fill={
                      COLORS[
                        index % COLORS.length
                      ]
                    }
                  />

                )
              )}

            </Pie>

            <Tooltip/>

          </PieChart>

        </ResponsiveContainer>

      </div>

    </div>

  );

}

export default DashboardCharts;