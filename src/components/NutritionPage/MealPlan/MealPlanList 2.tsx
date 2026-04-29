import MealPlanSummaryCard from "./MealPlanSummaryCard";
import type { MealPlan } from "./type";

type Props = {
    mealPlans: MealPlan[];
    onSelectPlan: (plan: MealPlan) => void;
};

const MealPlanList = ({ onSelectPlan, mealPlans }: Props) => {
    return (
        <div className="flex flex-col gap-3">
            {mealPlans.length > 0 ? (
                mealPlans.map((plan) => (
                    <MealPlanSummaryCard
                        onSelectPlan={onSelectPlan}
                        key={plan.meal_plan_id}
                        meal_plan={plan}
                    />
                ))
            ) : (
                <p>No meal plans found.</p>
            )}
        </div>
    );
};

export default MealPlanList;