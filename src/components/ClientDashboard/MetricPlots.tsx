import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ArrowRight } from "lucide-react";

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-4 py-2 rounded-xl shadow-md border text-sm">
        <p className="font-semibold">{label}</p>
        <p className="text-[#5B5EF4]">Weight (lb): {payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const ProgressBar = ({
  value,
  max,
  color,
}: {
  value: number;
  max: number;
  color: string;
}) => {
  const percent = (value / max) * 100;

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full"
        style={{ width: `${percent}%`, backgroundColor: color }}
      />
    </div>
  );
};

const data = [
  { week: "W1", weight: 182 },
  { week: "W2", weight: 180 },
  { week: "W3", weight: 179 },
  { week: "W4", weight: 178 },
  { week: "W5", weight: 177 },
];

const MetricPlots = () => {
  return (
    <section className="flex gap-6 px-38">
      <div className="bg-white p-6 rounded-3xl flex flex-col gap-8 w-full">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-[14px]">Weight Progress</div>
          <div className="text-[12px] bg-gray-300 px-2 rounded-2xl flex flex-col items-center">
            {data[data.length - 1].weight - data[0].weight}lbs
          </div>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <LineChart
            data={data}
            margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="week"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              padding={{ left: 20, right: 20 }}
            />

            <YAxis
              domain={["dataMin - 2", "dataMax + 2"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="monotone"
              dataKey="weight"
              stroke="#5B5EF4"
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2, fill: "white" }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white p-8 rounded-3xl flex flex-col gap-3 w-120 mx-auto">
        <div className="font-semibold text-[13px]">Today's Macros</div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[12px]">
            <span className="text-gray-600">Protein</span>
            <span>98g / 150g</span>
          </div>
          <ProgressBar value={98} max={150} color="#5B5EF4" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[12px]">
            <span className="text-gray-600">Carbs</span>
            <span>145g / 200g</span>
          </div>
          <ProgressBar value={145} max={200} color="#22c55e" />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[12px]">
            <span className="text-gray-600">Fat</span>
            <span>48g / 65g</span>
          </div>
          <ProgressBar value={48} max={65} color="#f59e0b" />
        </div>

        <div className="flex flex-col items-center">
          <div className="text-[18px] font-semibold flex items-baseline gap-1">1,450 <p className="text-[14px]">kcal</p></div>
        </div>

        <div className="flex items-center gap-0.5 px-3 h-8 mx-auto text-[12px] font-semibold bg-gray-200 text-gray-600 cursor-pointer rounded-lg  hover:bg-[#5B5EF4] hover:text-white">
          View Details
            <ArrowRight className="w-3 h-3 font-semibold" />
        </div>
      </div>
    </section>
  );
};

export default MetricPlots;
