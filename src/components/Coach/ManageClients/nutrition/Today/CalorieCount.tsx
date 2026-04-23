import { Meter } from "@heroui/react";

interface CalorieCountProps {
  Current: number;
  Goal: number;
}

const CalorieCount = ({ Current, Goal }: CalorieCountProps) => {
  const remaining = Math.max(Goal - Current, 0);

  return (
    <div className="w-full rounded-2xl border border-neutral-300 bg-white p-6">
      <div className="text-[15px] font-semibold text-[#0F0F14]">
        Daily Calories
      </div>

      <div className="mt-8 flex items-baseline gap-2">
        <span className="text-[28.125px] font-semibold text-[#0F0F14]">
          {Current}
        </span>
        <span className="text-[13.125px] font-medium text-[#72728A]">
          / {Goal} kcal
        </span>
      </div>

      <div>
        <Meter
          aria-label="Daily calories progress"
          className="w-full"
          value={Current}
          maxValue={Goal}
          color="accent"
        >
          <Meter.Track className="h-3 rounded-full bg-[#DCDCF4]">
            <Meter.Fill className="rounded-full bg-[#5E5EF4]" />
          </Meter.Track>
        </Meter>
      </div>

      <div className="mt-4 text-[13.125px] text-[#72728A]">
        {remaining} kcal remaining
      </div>
    </div>
  );
};

export default CalorieCount;
