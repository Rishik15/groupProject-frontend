import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useEffect, useState } from "react";
import {
  getCalories,
  getWorkoutCompletion,
} from "../../../../services/ManageClients/dashboard/dashboardApi";

const SessionTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const completed = payload.find(
      (p: any) => p.dataKey === "completed",
    )?.value;
    const planned = payload.find((p: any) => p.dataKey === "planned")?.value;

    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-md border text-sm">
        <p className="font-semibold mb-1">{label}</p>

        <p className="text-[#5B5EF4]">completed : {completed}</p>

        <p className="text-gray-500">planned : {planned}</p>
      </div>
    );
  }
  return null;
};

const CaloriesTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const actual = payload.find((p: any) => p.dataKey === "actual")?.value;

    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-md border text-sm">
        <p className="font-semibold mb-1">{label}</p>

        <p className="text-[#22c55e]">Calorie : {actual}</p>
      </div>
    );
  }
  return null;
};

const MetricPlots2 = ({ contract_id }: { contract_id: number }) => {
  const [calorieData, setCalorieData] = useState([]);
  const [sessionData, setSessionData] = useState([]);
  const [summary, setSummary] = useState({ planned: 0, completed: 0 });

  useEffect(() => {
    const fetchData = async () => {
      const calData = await getCalories(contract_id);
      const formattedCalories = calData.map((d: any) => ({
        day: d.day,
        actual: d.calories,
      }));
      setCalorieData(formattedCalories);

      const workoutData = await getWorkoutCompletion(contract_id);

      const formattedSessions = workoutData.days.map((d: any) => ({
        day: d.day,
        planned: d.planned,
        completed: d.completed,
      }));

      setSessionData(formattedSessions);
      setSummary(workoutData.summary);
    };

    fetchData();
  }, []);

  return (
    <section className="flex gap-6 px-12 mt-6">
      <div className="bg-white px-6 py-4 rounded-3xl flex flex-col gap-4 w-full">
        <div className="flex justify-between items-center">
          <div className="font-semibold text-[14px]">Session Completion</div>
          <div className="text-[12px] text-gray-500">
            {summary.completed}/{summary.planned} this week
          </div>
        </div>

        <ResponsiveContainer width="100%" height={160}>
          <BarChart data={sessionData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              padding={{ left: 10, right: 10 }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <Tooltip content={SessionTooltip} />

            <Bar dataKey="planned" fill="#A9A9A9" radius={[4, 4, 0, 0]} />

            <Bar dataKey="completed" fill="#5B5EF4" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-4 text-[12px] text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full" />
            Planned
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-[#5B5EF4] rounded-full" />
            Completed
          </div>
        </div>
      </div>

      <div className="bg-white py-4 px-6 rounded-3xl flex flex-col gap-4 w-full">
        <div className="font-semibold text-[14px] py-2">Weekly Calories</div>

        <ResponsiveContainer width="100%" height={160}>
          <LineChart data={calorieData}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#e5e7eb"
            />

            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
              padding={{ left: 20, right: 20 }}
            />

            <YAxis
              domain={["dataMin - 100", "dataMax + 100"]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#6b7280", fontSize: 12 }}
            />

            <Tooltip content={CaloriesTooltip} />

            <Line
              type="monotone"
              dataKey="goal"
              stroke="#9ca3af"
              strokeDasharray="4 4"
              dot={false}
            />

            <Line
              type="monotone"
              dataKey="actual"
              stroke="#22c55e"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <div className="flex justify-center gap-2 text-[12px] text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-3 h-0.5 bg-[#22c55e]" />
            Daily Calories
          </div>
        </div>
      </div>
    </section>
  );
};

export default MetricPlots2;
