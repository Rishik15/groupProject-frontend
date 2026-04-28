import { Card } from "@heroui/react";
import type { Meal, MealType } from "@/utils/Interfaces/Nutrition/mealPlan";

type Props = {
  day: string;
  meals: Meal[];
};

const mealTypeStyles: Record<MealType, string> = {
  breakfast: "border-yellow-200 bg-yellow-50 text-yellow-700",
  lunch: "border-green-200 bg-green-50 text-green-700",
  dinner: "border-blue-200 bg-blue-50 text-blue-700",
  snack: "border-purple-200 bg-purple-50 text-purple-700",
};

const DayCard = ({ day, meals }: Props) => {
  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);

  return (
    <Card
      variant="transparent"
      className="border border-[#E6E6EE] bg-[#FAFAFF] p-3"
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-[14px] font-bold text-black">{day}</p>
          <p className="text-[12px] text-[#72728A]">
            {meals.length} {meals.length === 1 ? "meal" : "meals"}
          </p>
        </div>

        {meals.length > 0 && (
          <span className="rounded-full bg-[#EDEBFF] px-2.5 py-1 text-[12px] font-semibold text-[#5E5EF4]">
            {totalCalories} kcal
          </span>
        )}
      </div>

      {meals.length > 0 ? (
        <div className="flex flex-col gap-2">
          {meals.map((meal, index) => (
            <div
              key={`${meal.meal_id}-${meal.day_of_week}-${meal.meal_type}-${index}`}
              className="rounded-xl border border-[#E6E6EE] bg-white px-3 py-2"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-semibold text-black">
                    {meal.name}
                  </p>
                  <p className="text-[12px] text-[#72728A]">
                    {meal.servings} serving{meal.servings === 1 ? "" : "s"}
                  </p>
                </div>

                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[12px] font-semibold capitalize ${
                    mealTypeStyles[meal.meal_type]
                  }`}
                >
                  {meal.meal_type}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="rounded-full bg-gray-100 px-2 py-0.5 text-[12px] text-[#55556A]">
                  {meal.calories} kcal
                </span>

                <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[12px] text-blue-600">
                  {meal.protein}g P
                </span>

                <span className="rounded-full bg-yellow-50 px-2 py-0.5 text-[12px] text-yellow-700">
                  {meal.carbs}g C
                </span>

                <span className="rounded-full bg-pink-50 px-2 py-0.5 text-[12px] text-pink-600">
                  {meal.fats}g F
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#D8D8E8] bg-white py-5 text-center">
          <p className="text-[12px] text-[#72728A]">No meals.</p>
        </div>
      )}
    </Card>
  );
};

export default DayCard;
