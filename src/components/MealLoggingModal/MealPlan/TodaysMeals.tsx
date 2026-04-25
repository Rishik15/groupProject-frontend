import { Button } from "@heroui/react";
import type { TodayMeal } from "../../../services/MealLogging/mealPlanLogService";

const mealTypeColors: Record<string, { bg: string; text: string }> = {
    breakfast: { bg: "bg-yellow-100", text: "text-yellow-700" },
    lunch:     { bg: "bg-green-100",  text: "text-green-700"  },
    dinner:    { bg: "bg-blue-100",   text: "text-blue-700"   },
    snack:     { bg: "bg-purple-100", text: "text-purple-700" },
};

interface TodaysMealsProps {
    meals: TodayMeal[];
    isLoading: boolean;
    onLogMeal: (meal: TodayMeal) => void;
}

export default function TodaysMeals({ meals, isLoading, onLogMeal }: TodaysMealsProps) {
    if (isLoading) {
        return (
            <p className="text-[13.125px] text-[#72728A]">Loading today's meals...</p>
        );
    }

    if (meals.length === 0) {
        return (
            <p className="text-[13.125px] text-[#72728A]">
                No meals scheduled for today in this plan.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            <p className="text-[13.125px] font-semibold text-[#0F0F14]">
                Today's Meals
            </p>

            {meals.map((meal) => {
                const colors = mealTypeColors[meal.meal_type] ?? {
                    bg: "bg-gray-100",
                    text: "text-gray-700",
                };

                return (
                    <div
                        key={`${meal.meal_id}-${meal.meal_type}`}
                        className="flex items-center justify-between rounded-xl border border-default-200 bg-white p-3"
                    >
                        <div className="min-w-0 space-y-1">
                            <div className="flex items-center gap-2">
                                <span
                                    className={`rounded-xl px-2 py-0.5 text-[11.25px] font-semibold capitalize ${colors.bg} ${colors.text}`}
                                >
                                    {meal.meal_type}
                                </span>
                            </div>

                            <p className="text-[13.125px] font-medium text-[#0F0F14]">
                                {meal.name}
                            </p>

                            <p className="text-[11.25px] text-[#72728A]">
                                {meal.calories} kcal · {meal.protein}P · {meal.carbs}C · {meal.fats}F
                            </p>
                        </div>

                        <Button
                            className="ml-4 h-[30px] shrink-0 rounded-xl bg-[#5E5EF4] px-3 text-[13.125px] font-medium text-white"
                            onPress={() => onLogMeal(meal)}
                        >
                            Log
                        </Button>
                    </div>
                );
            })}
        </div>
    );
}