import { Flame } from "lucide-react";
import { Activity, Dumbbell, Target } from "lucide-react";

const MetricRow = () => {
  return (
    <section className="flex px-38 py-6 mx-auto gap-10 grid-cols-4">
      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 w-full shadow-[0_0_0_1px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center p-2 bg-[#e8e8ff] rounded-xl">
          <Flame className="w-4 h-4 text-[#7273a2]" />
        </div>

        <div className="flex flex-col">
          <div className="text-[14px] text-gray-500">Calories</div>
          <div className="text-[16px] font-semibold">1400</div>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 w-full shadow-[0_0_0_1px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center p-2 bg-[#e8e8ff] rounded-xl">
          <Activity className="w-4 h-4 text-[#7273a2]" />
        </div>

        <div className="flex flex-col">
          <div className="text-[14px] text-gray-500">Steps</div>
          <div className="text-[16px] font-semibold">8000</div>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 w-full shadow-[0_0_0_1px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center p-2 bg-[#e8e8ff] rounded-xl">
          <Dumbbell className="w-4 h-4 text-[#7273a2]" />
        </div>

        <div className="flex flex-col">
          <div className="text-[14px] text-gray-500">Workouts</div>
          <div className="text-[16px] font-semibold">1</div>
        </div>
      </div>
      <div className="flex items-center gap-3 bg-white rounded-xl px-5 py-4 w-full shadow-[0_0_0_1px_rgba(0,0,0,0.03),_0_4px_12px_rgba(0,0,0,0.04)]">
        <div className="flex items-center justify-center p-2 bg-[#e8e8ff] rounded-xl">
          <Target className="w-4 h-4 text-[#7273a2]" />
        </div>

        <div className="flex flex-col">
          <div className="text-[14px] text-gray-500">Streak</div>
          <div className="text-[16px] font-semibold">7 days</div>
        </div>
      </div>
    </section>
  );
};

export default MetricRow;
