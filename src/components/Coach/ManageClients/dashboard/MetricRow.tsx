import { Flame, Activity, Dumbbell, Target } from "lucide-react";
import { useState, useEffect } from "react";
import { getMetrics } from "../../../../services/ManageClients/dashboard/dashboardApi";

type Metrics = {
  calories: number;
  steps: number;
  workouts: number;
  streak: number;
};

const MetricRow = ({ contract_id }: { contract_id: number }) => {
  const [metrics, setMetrics] = useState<Metrics>({
    calories: 0,
    steps: 0,
    workouts: 0,
    streak: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getMetrics(contract_id);
        setMetrics(data);
      } catch (err) {
        console.error("Failed to fetch metrics", err);
      }
    };

    fetchMetrics();
  }, []);

  return (
    <section className="flex px-16 py-4 mx-auto gap-10 grid-cols-4">
      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 w-full shadow-[0_0_0_1px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center p-2 bg-[#e8e8ff] rounded-xl">
          <Flame className="w-4 h-4 text-[#7273a2]" />
        </div>
        <div className="flex flex-col">
          <div className="text-[14px] text-gray-500">Calories</div>
          <div className="text-[16px] font-semibold">{metrics.calories}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 w-full shadow-[0_0_0_1px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center p-2 bg-[#e8e8ff] rounded-xl">
          <Activity className="w-4 h-4 text-[#7273a2]" />
        </div>
        <div className="flex flex-col">
          <div className="text-[14px] text-gray-500">Steps</div>
          <div className="text-[16px] font-semibold">{metrics.steps}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 w-full shadow-[0_0_0_1px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center p-2 bg-[#e8e8ff] rounded-xl">
          <Dumbbell className="w-4 h-4 text-[#7273a2]" />
        </div>
        <div className="flex flex-col">
          <div className="text-[14px] text-gray-500">Workouts</div>
          <div className="text-[16px] font-semibold">{metrics.workouts}</div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 w-full shadow-[0_0_0_1px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center p-2 bg-[#e8e8ff] rounded-xl">
          <Target className="w-4 h-4 text-[#7273a2]" />
        </div>
        <div className="flex flex-col">
          <div className="text-[14px] text-gray-500">Streak</div>
          <div className="text-[16px] font-semibold">{metrics.streak} days</div>
        </div>
      </div>
    </section>
  );
};

export default MetricRow;
