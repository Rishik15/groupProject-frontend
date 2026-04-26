import { useMemo } from "react";
import { Card } from "@heroui/react";
import type { WeeklyCaloriesSummary } from "@/services/ManageClients/nutrition/getNutrition";

interface WeeklyCaloriesProps {
  summary: WeeklyCaloriesSummary | null;
  isLoading: boolean;
}

const WeeklyCalories = ({ summary, isLoading }: WeeklyCaloriesProps) => {
  const maxCalories = useMemo(() => {
    const highestDay = Math.max(
      ...(summary?.days.map((day) => day.calories) ?? [0]),
    );

    return Math.max(highestDay, summary?.goalCalories ?? 0, 2400);
  }, [summary]);

  if (isLoading || !summary) {
    return (
      <Card className="w-full rounded-2xl border border-neutral-300 bg-white shadow-none">
        <div className="py-8">
          <h2 className="px-0 text-[15px] font-semibold text-[#0F0F14]">
            Weekly Calorie Intake
          </h2>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full rounded-2xl border border-neutral-300 bg-white shadow-none">
      <div className="py-8">
        <h2 className="px-0 text-[15px] font-semibold text-[#0F0F14]">
          Weekly Calorie Intake
        </h2>

        <div className="mt-8">
          <div className="grid grid-cols-[48px_1fr] gap-2">
            <div className="relative h-80 text-[12px] text-[#72728A]">
              {[2400, 1800, 1200, 600, 0].map((value, index) => (
                <div
                  key={value}
                  className={`absolute right-0 w-full text-right ${
                    index === 0
                      ? "top-0"
                      : index === 1
                        ? "top-1/4"
                        : index === 2
                          ? "top-2/4"
                          : index === 3
                            ? "top-3/4"
                            : "bottom-0"
                  }`}
                >
                  {value}
                </div>
              ))}
            </div>

            <div className="relative h-80">
              {[0, 1, 2, 3, 4].map((line) => (
                <div
                  key={line}
                  className="absolute left-0 right-0 border-t border-dashed border-[#E5E7F0]"
                  style={{
                    top: line === 4 ? "100%" : `${line * 25}%`,
                  }}
                />
              ))}

              <div className="absolute inset-0 flex items-end justify-between gap-4">
                {summary.days.map((day) => {
                  const heightPercent =
                    maxCalories > 0 ? (day.calories / maxCalories) * 100 : 0;

                  const barHeightPercent = Math.max(heightPercent, 2);

                  return (
                    <div
                      key={day.dayKey}
                      className="group relative flex min-w-0 flex-1 flex-col items-center justify-end"
                    >
                      <div className="relative flex h-70 w-full items-end justify-center">
                        <div
                          className="pointer-events-none absolute z-20 hidden -translate-y-3 rounded-2xl border border-[#D9D9E8] bg-white px-5 py-3 text-center shadow-md group-hover:block"
                          style={{
                            bottom: `${barHeightPercent}%`,
                          }}
                        >
                          <div className="text-[13.125px] font-medium text-[#0F0F14]">
                            {day.dayLabel}
                          </div>
                          <div className="text-[13.125px] font-medium text-[#0F0F14]">
                            {day.calories} kcal
                          </div>
                        </div>

                        <div
                          className="w-full max-w-30 rounded-t-xl bg-[#5E5EF4] transition-opacity duration-150 group-hover:opacity-90"
                          style={{
                            height: `${barHeightPercent}%`,
                          }}
                        />
                      </div>

                      <div className="mt-3 text-[12px] text-[#72728A]">
                        {day.dayLabel}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <div className="flex h-[60px] flex-1 flex-col items-center justify-center rounded-2xl bg-[#F6F6FA] px-4">
            <div className="text-[13.125px] font-semibold text-[#0F0F14]">
              {summary.averageDailyCalories.toLocaleString()} kcal
            </div>
            <div className="text-[11.25px] text-[#72728A]">Avg. Daily</div>
          </div>

          <div className="flex h-[60px] flex-1 flex-col items-center justify-center rounded-2xl bg-[#F6F6FA] px-4">
            <div className="text-[13.125px] font-semibold text-[#0F0F14]">
              {summary.bestDayCalories.toLocaleString()} kcal
            </div>
            <div className="text-[11.25px] text-[#72728A]">Best Day</div>
          </div>

          <div className="flex h-[60px] flex-1 flex-col items-center justify-center rounded-2xl bg-[#F6F6FA] px-4">
            <div className="text-[13.125px] font-semibold text-[#0F0F14]">
              {summary.goalCalories !== null
                ? `${summary.goalCalories.toLocaleString()} kcal`
                : "No goal set"}
            </div>
            <div className="text-[11.25px] text-[#72728A]">Goal</div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default WeeklyCalories;
