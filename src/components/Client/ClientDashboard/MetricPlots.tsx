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
import { useState, useEffect } from "react";
import { getWeight } from "../../../services/dashboard/client/getMetrics";
import { getNutrition } from "../../../services/dashboard/client/getNutrition";

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

const MetricPlots = () => {
  const [data, setData] = useState<any[]>([]);
  const [nutrition, setNutrition] = useState<any>(null);

  useEffect(() => {
    const fetchWeight = async () => {
      try {
        const res = await getWeight();

        const formatted = res.weekly.map((item: any) => ({
          week: item.week.replace("2026-", ""),
          weight: item.avg_weight,
        }));

        setData(formatted);
      } catch (err) {
        console.error("Failed to fetch weight:", err);
      }
    };

    const fetchNutrition = async () => {
      const nutritionData = await getNutrition();
      setNutrition(nutritionData);
    };

    fetchNutrition();
    fetchWeight();
  }, []);

  const consumed = nutrition?.consumed || {};
  const target = nutrition?.target || {};

  const formatMacro = (value: any, target: any) => {
    const v = Math.round(Number(value || 0));
    const t = target ? Math.round(Number(target)) : null;

    return t ? `${v}g / ${t}g` : `${v}g`;
  };
  const format = (val: any) => Math.round(Number(val || 0));

  return (
    <section className="flex gap-6 px-38">
      <div className="bg-white py-6 px-10 rounded-3xl flex flex-col gap-8 w-full">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-[14px]">Weight Progress</div>
          <div className="text-[12px] bg-gray-300 px-2 rounded-2xl flex flex-col items-center">
            {data.length > 0
              ? data[data.length - 1].weight - data[0].weight
              : 0}
            lbs
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
            <span>{formatMacro(consumed.protein, target.protein)}</span>
          </div>
          <ProgressBar
            value={consumed.protein || 0}
            max={target.protein || 150}
            color="#5B5EF4"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[12px]">
            <span className="text-gray-600">Carbs</span>
            <span>{formatMacro(consumed.carbs, target.carbs)}</span>
          </div>
          <ProgressBar
            value={consumed.carbs || 0}
            max={target.carbs || 200}
            color="#22c55e"
          />
        </div>

        <div className="flex flex-col gap-1">
          <div className="flex justify-between text-[12px]">
            <span className="text-gray-600">Fat</span>
            <span>{formatMacro(consumed.fat, target.fat)}</span>
          </div>
          <ProgressBar
            value={consumed.fat || 0}
            max={target.fat || 65}
            color="#f59e0b"
          />
        </div>

        <div className="flex flex-col items-center">
          <div className="text-[18px] font-semibold flex items-baseline gap-1">
            {format(consumed.calories)}
            <p className="text-[14px]">kcal</p>
          </div>
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
