import { Button, Card, Chip, Spinner } from "@heroui/react";
import type { TodayMeal } from "../../../services/meallogging/logMealService";

const mealTypeColors: Record<
  string,
  "default" | "accent" | "success" | "warning" | "danger"
> = {
  breakfast: "warning",
  lunch: "success",
  dinner: "accent",
  snack: "default",
};

interface TodaysMealsProps {
  meals: TodayMeal[];
  isLoading: boolean;
  onLogMeal: (meal: TodayMeal) => void;
}

export default function TodaysMeals({
  meals,
  isLoading,
  onLogMeal,
}: TodaysMealsProps) {
  if (isLoading) {
    return (
      <Card className="rounded-2xl border border-default-200 bg-white shadow-none">
        <div className="flex items-center gap-3 p-4">
          <Spinner size="sm" />
          <p className="text-[13.125px] text-[#72728A]">
            Loading today&apos;s meals...
          </p>
        </div>
      </Card>
    );
  }

  if (meals.length === 0) {
    return (
      <Card className="rounded-2xl border border-default-200 bg-white shadow-none">
        <div className="p-4">
          <p className="text-[13.125px] text-[#72728A]">
            No meals scheduled for today in this plan.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="rounded-2xl border border-default-200 bg-white shadow-none">
      <div className="space-y-3 p-4">
        <p className="text-[13.125px] font-semibold text-[#0F0F14]">
          Today&apos;s Meals
        </p>

        {meals.map((meal) => {
          const color = mealTypeColors[meal.meal_type] ?? "default";

          return (
            <div
              key={`${meal.meal_id}-${meal.meal_type}`}
              className="flex items-center justify-between gap-4 rounded-xl border border-default-100 bg-white p-3"
            >
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <Chip size="sm" color={color} variant="soft">
                    <Chip.Label className="capitalize">
                      {meal.meal_type}
                    </Chip.Label>
                  </Chip>

                  <p className="truncate text-[13.125px] font-medium text-[#0F0F14]">
                    {meal.name}
                  </p>
                </div>

                <p className="text-[11.25px] text-[#72728A]">
                  {meal.calories} kcal · {meal.protein}P · {meal.carbs}C ·{" "}
                  {meal.fats}F
                </p>
              </div>

              <Button
                size="sm"
                className="shrink-0 bg-[#5E5EF4] text-white"
                onPress={() => onLogMeal(meal)}
              >
                Log
              </Button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
