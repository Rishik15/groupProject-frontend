import { Card } from "@heroui/react";
import type { Meal } from "./type";

type Props = {
    day: string;
    meals: Meal[];
};

const mealTypeStyles = {
    breakfast: {
        p: "px-1 py-1",
        bg: "bg-yellow-100",
        text: "text-yellow-700",
    },
    lunch: {
        p: "px-1 py-1",
        bg: "bg-green-100",
        text: "text-green-700",
    },
    dinner: {
        p: "px-1 py-1",
        bg: "bg-blue-100",
        text: "text-blue-700",
    },
    snack: {
        p: "px-1 py-1",
        bg: "bg-purple-100",
        text: "text-purple-700",
    },
};

const DayCard = ({ day, meals }: Props) => {
    return (
        <Card className="border rounded-2xl p-4 bg-[#fafaff]">
            <h3 className="mb-3 text-lg font-bold">{day}</h3>

            {meals.length > 0 ? (
                <div className="flex flex-col gap-2">
                    {meals.map((meal) => (
                        <Card key={meal.meal_id} className="rounded-lg border p-2">
                            <p
                                className={`${mealTypeStyles[meal.meal_type].bg} ${mealTypeStyles[meal.meal_type].text} w-fit rounded-2xl px-2 py-1 text-sm font-semibold capitalize`}
                            >
                                {meal.meal_type}

                            </p>
                            <p className="font-bold">{meal.name}</p>
                            <div className="flex gap-1 pr-2">
                                <p className="border rounded-2xl bg-gray-100 px-2 font-bold  text-sm text-black">
                                    {meal.calories}
                                </p>
                                <p className="border rounded-2xl bg-gray-100 px-2 font-bold  text-sm text-black">
                                    {meal.protein}P</p>
                                <p className="border rounded-2xl bg-gray-100 px-2 font-bold  text-sm text-black">
                                    {meal.carbs}C</p>
                                <p className="border rounded-2xl bg-gray-100 px-2 font-bold  text-sm text-black">
                                    {meal.fats}F</p>
                            </div>
                        </Card>
                    ))}
                </div>
            ) : (
                <p className="text-sm text-gray-400">No meals for this day.</p>
            )}
        </Card>
    );
};

export default DayCard;