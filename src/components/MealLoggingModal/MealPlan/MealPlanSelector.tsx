import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/event-calendar/ui/select";
import type { UserMealPlan } from "../../../services/MealLogging/mealPlanLogService";

interface MealPlanSelectorProps {
    plans: UserMealPlan[];
    selectedPlanId: number | null;
    onChange: (planId: number) => void;
    isLoading: boolean;
}
export default function MealPlanSelector({
    plans,
    selectedPlanId,
    onChange,
    isLoading,
}: MealPlanSelectorProps) {
    return (
        <div className="space-y-1">
            <label className="block text-[13.125px] font-semibold text-[#0F0F14]">
                Select Meal Plan
            </label>

            <select
                disabled={isLoading || plans.length === 0}
                value={selectedPlanId ? String(selectedPlanId) : ""}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full rounded-xl border border-default-200 bg-white px-3 py-2 text-[13.125px] text-[#0F0F14] outline-none focus:border-[#5E5EF4]"
            >
                <option value="" disabled>
                    {isLoading ? "Loading plans..." : "Choose a meal plan"}
                </option>
                {plans.map((plan) => (
                    <option key={plan.meal_plan_id} value={String(plan.meal_plan_id)}>
                        {plan.plan_name}{plan.total_calories ? ` — ${plan.total_calories} kcal` : ""}
                    </option>
                ))}
            </select>

            {!isLoading && plans.length === 0 && (
                <p className="text-[11.25px] text-[#72728A]">
                    No meal plans found. Create one in the Meal Plans tab.
                </p>
            )}
        </div>
    );
}