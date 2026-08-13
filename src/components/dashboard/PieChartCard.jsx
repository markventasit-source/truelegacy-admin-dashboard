import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Clock } from "lucide-react";

const COLORS = ["#048D21", "#3C30C2"];

const PieChartCard = ({ title, subtitle, data }) => {
  return (
    <div className="border border-[#E4E4E7] rounded-xl shadow-xs bg-[#FCFCFC]">
      <div className="flex items-center gap-2 mb-4 border-b border-[#E4E4E7] p-5">
        <Clock className="w-4 h-4 text-gray-500" />
        <p className="text-sm  text-gray-700">Pie Chart</p>
      </div>
      <h2 className="text-base font-semibold text-center">{title}</h2>
      <p className="text-sm text-gray-500 text-center mb-4">{subtitle}</p>

      <div className="w-full h-64">
        <ResponsiveContainer>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={100}
              dataKey="value"
              label={false}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center gap-6 mt-4 text-xs p-5">
        {data.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            ></span>
            <span className="text-gray-700">
              {item.name} - {item.value}{" "}
            </span>
          </div>
        ))}{" "}
      </div>
    </div>
  );
};

export default PieChartCard;
