import { Card } from "@heroui/react";
import type { MealPlanSummary } from "@/utils/Interfaces/Nutrition/mealPlan";

type Props = {
  mealPlan: MealPlanSummary;
  isSelected: boolean;
  onSelectPlan: (plan: MealPlanSummary) => void;
};

const MealPlanSummaryCard = ({ mealPlan, isSelected, onSelectPlan }: Props) => {
  return (
    <button
      type="button"
      onClick={() => onSelectPlan(mealPlan)}
      className="w-full text-left"
    >
      <Card
        className={`w-full border p-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
          isSelected
            ? "border-[#5E5EF4] bg-[#F3F3FF] shadow-sm"
            : "border-[#E6E6EE] bg-white hover:border-[#B8B8FF]"
        }`}
      >
        <Card.Content className="px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-[14px] font-bold text-black">
                {mealPlan.plan_name.split(" - ")[0]}
              </p>

              <p className="mt-0.5 text-[12px] text-[#72728A]">
                Weekly meal plan
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-[#EDEBFF] px-3 py-1 text-[12px] font-semibold text-[#5E5EF4]">
              {mealPlan.total_calories} kcal
            </span>
          </div>
        </Card.Content>
      </Card>
    </button>
  );
};

export default MealPlanSummaryCard;
