import MealPlanSummaryCard from "./MealPlanSummaryCard";
import type { MealPlanSummary } from "@/utils/Interfaces/Nutrition/mealPlan";

type Props = {
  mealPlans: MealPlanSummary[];
  selectedPlanId: number | null;
  onSelectPlan: (plan: MealPlanSummary) => void;
};

const MealPlanList = ({ mealPlans, selectedPlanId, onSelectPlan }: Props) => {
  if (mealPlans.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[#D8D8E8] bg-[#FAFAFF] px-4 py-10 text-center">
        <p className="text-[14px] font-semibold text-black">No plans found</p>
        <p className="mt-1 text-[12px] text-[#72728A]">
          Try a different search.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {mealPlans.map((plan) => (
        <MealPlanSummaryCard
          key={plan.meal_plan_id}
          mealPlan={plan}
          isSelected={selectedPlanId === plan.meal_plan_id}
          onSelectPlan={onSelectPlan}
        />
      ))}
    </div>
  );
};

export default MealPlanList;
