import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Calendar } from "lucide-react";

const COLORS = {
  admin: "#00AE25", // green
  login: "#3700FF", // blue
  documents: "#FF00A6", // pink
};

const LineChartCard = ({ title, subtitle, data }) => {
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className="border border-[#E4E4E7] rounded-xl shadow-xs bg-[#FCFCFC]">
      <div className="flex items-center justify-between border-b border-[#E4E4E7] p-5">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-500" />
          <p className="text-sm text-gray-700">Line Chart</p>
        </div>
      </div>
      <div className="p-5">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
      </div>

      <div className="w-full h-64 px-5 pb-5 flex justify-center items-center">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={safeData}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 12 }}
              tickLine={false}
              padding={{ left: 10, right: 10 }}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              width={25}
              axisLine={false}
              tickLine={false}
            />{" "}
            <Tooltip />
            <Line
              type="monotone"
              dataKey="admin"
              stroke={COLORS.admin}
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="login"
              stroke={COLORS.login}
              strokeWidth={3}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="documents"
              stroke={COLORS.documents}
              strokeWidth={3}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 gap-4 text-xs p-5 place-items-center">
        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: COLORS.admin }}
          ></span>
          <span>Admin Actions</span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: COLORS.login }}
          ></span>
          <span>User Logins</span>
        </div>

        <div className="flex items-center gap-2 col-span-2 justify-center">
          <span
            className="w-2 h-2 rounded-full"
            style={{ background: COLORS.documents }}
          ></span>
          <span>Documents Uploaded</span>
        </div>
      </div>
    </div>
  );
};

export default LineChartCard;
