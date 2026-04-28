import { Label, ListBox, Select } from "@heroui/react";
import type { Key } from "react";
import type { UserMealPlan } from "../../../services/meallogging/logMealService";

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
  const selectedKey = selectedPlanId ? String(selectedPlanId) : null;

  const handleChange = (key: Key | Key[] | null) => {
    if (key === null || Array.isArray(key)) return;

    const planId = Number(key);

    if (!Number.isNaN(planId)) {
      onChange(planId);
    }
  };

  return (
    <div className="space-y-1">
      <Select
        className="w-full"
        fullWidth
        variant="secondary"
        placeholder={isLoading ? "Loading plans..." : "Choose a meal plan"}
        value={selectedKey}
        onChange={handleChange}
        isDisabled={isLoading || plans.length === 0}
      >
        <Label className="text-[13.125px] font-semibold text-[#0F0F14]">
          Select Meal Plan
        </Label>

        <Select.Trigger className="rounded-xl border border-default-200 bg-white px-3 py-2">
          <Select.Value />
          <Select.Indicator />
        </Select.Trigger>

        <Select.Popover className="rounded-xl bg-white p-2 shadow-lg">
          <ListBox>
            {plans.map((plan) => (
              <ListBox.Item
                key={String(plan.meal_plan_id)}
                id={String(plan.meal_plan_id)}
                textValue={plan.plan_name}
                className="rounded-xl px-3 py-2"
              >
                <div className="flex flex-col">
                  <span className="text-[13.125px] font-medium text-[#0F0F14]">
                    {plan.plan_name}
                  </span>

                  {plan.total_calories !== null && (
                    <span className="text-[11.25px] text-[#72728A]">
                      {plan.total_calories} kcal
                    </span>
                  )}
                </div>

                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Select.Popover>
      </Select>

      {!isLoading && plans.length === 0 && (
        <p className="text-[11.25px] text-[#72728A]">No meal plans found.</p>
      )}
    </div>
  );
}
