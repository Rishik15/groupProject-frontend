import { useEffect, useState } from "react";
import { Meter } from "@heroui/react";
import { getNutritionGoals } from "../../../services/nutrition/nutritionGoals";

interface CalorieCountProps {
  Current: number;
  Goal: number | null;
}

const DEFAULT_VISUAL_CALORIE_MAX = 2000;

const CalorieCount = ({ Current, Goal }: CalorieCountProps) => {
  const [calorieGoal, setCalorieGoal] = useState<number | null>(Goal);

  useEffect(() => {
    setCalorieGoal(Goal);
  }, [Goal]);

  useEffect(() => {
    const loadGoal = async () => {
      try {
        const goals = await getNutritionGoals();

        if (goals) {
          setCalorieGoal(goals.calories_target);
        } else {
          setCalorieGoal(null);
        }
      } catch (err) {
        console.error("Failed to load calorie goal:", err);
      }
    };

    loadGoal();

    window.addEventListener("nutritionGoalsUpdated", loadGoal);

    return () => {
      window.removeEventListener("nutritionGoalsUpdated", loadGoal);
    };
  }, []);

  const hasGoal = typeof calorieGoal === "number" && calorieGoal > 0;

  const meterMaxValue = hasGoal ? calorieGoal : DEFAULT_VISUAL_CALORIE_MAX;
  const meterValue = Math.min(Current, meterMaxValue);
  const remaining = hasGoal ? Math.max(calorieGoal - Current, 0) : null;

  return (
    <div className="w-full rounded-2xl border border-neutral-300 bg-white p-6">
      <div className="text-[15px] font-semibold text-[#0F0F14]">
        Daily Calories
      </div>

      <div className="mt-8 flex items-baseline gap-2">
        <span className="text-[28.125px] font-semibold text-[#0F0F14]">
          {Current}
        </span>

        {hasGoal && (
          <span className="text-[13.125px] font-medium text-[#72728A]">
            / {calorieGoal} kcal
          </span>
        )}
      </div>

      <div>
        <Meter
          aria-label="Daily calories progress"
          className="w-full"
          value={meterValue}
          maxValue={meterMaxValue}
          color="accent"
        >
          <Meter.Track className="h-3 rounded-full bg-[#DCDCF4]">
            <Meter.Fill className="rounded-full bg-[#5E5EF4]" />
          </Meter.Track>
        </Meter>
      </div>

      <div className="mt-4 text-[13.125px] text-[#72728A]">
        {hasGoal ? `${remaining} kcal remaining` : "No calorie goal set"}
      </div>
    </div>
  );
};

export default CalorieCount;
