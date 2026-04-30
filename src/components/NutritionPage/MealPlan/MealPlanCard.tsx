import { Button, Card, Separator } from "@heroui/react";
import DayCard from "./DayCard";
import type { MealPlanDetail } from "@/utils/Interfaces/Nutrition/mealPlan";
import { DAYS } from "@/utils/Interfaces/Nutrition/mealPlan";

type Props = {
  mealPlan: MealPlanDetail;
  onAssign: () => void;
};

const MealPlanCard = ({ mealPlan, onAssign }: Props) => {
  const totalMeals = mealPlan.meals.length;

  const totalProtein = mealPlan.meals.reduce(
    (sum, meal) => sum + meal.protein,
    0,
  );

  const totalCarbs = mealPlan.meals.reduce((sum, meal) => sum + meal.carbs, 0);

  const totalFats = mealPlan.meals.reduce((sum, meal) => sum + meal.fats, 0);

  return (
    <Card className="h-[550px] w-full border border-[#E6E6EE] bg-white p-0 shadow-sm">
      <Card.Header className="flex flex-col gap-3 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <Card.Description className="text-[12px] font-bold uppercase tracking-[1.5px] text-[#5E5EF4]">
            Selected Meal Plan
          </Card.Description>

          <Card.Title className="mt-1 truncate text-[18px] font-bold text-black">
            {mealPlan.plan_name.split(" - ")[0]}
          </Card.Title>

          <p className="mt-1 text-[12px] text-[#72728A]">
            Weekly breakdown with meals and macros.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-2">
          <span className="rounded-full bg-[#EDEBFF] px-3 py-1 text-[12px] font-semibold text-[#5E5EF4]">
            {mealPlan.total_calories} kcal
          </span>

          <span className="rounded-full bg-[#F4F4F8] px-3 py-1 text-[12px] font-semibold text-[#666678]">
            {totalMeals} meals
          </span>

          <Button
            variant="tertiary"
            className="h-8 rounded-xl bg-[#5E5EF4] px-4 text-[12px] font-semibold text-white hover:bg-[#4B4EE4]"
            onPress={onAssign}
          >
            Assign
          </Button>
        </div>
      </Card.Header>

      <Separator />

      <Card.Content className="flex min-h-0 flex-1 flex-col px-4 py-3">
        <div className="h-[415px] overflow-y-auto pr-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            {DAYS.map((day) => {
              const mealsForDay = mealPlan.meals.filter(
                (meal) => meal.day_of_week === day.key,
              );

              return (
                <DayCard key={day.key} day={day.label} meals={mealsForDay} />
              );
            })}
          </div>
        </div>
      </Card.Content>
    </Card>
  );
};

export default MealPlanCard;
