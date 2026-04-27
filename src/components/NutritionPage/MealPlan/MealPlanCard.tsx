import { Card, ScrollShadow } from "@heroui/react";
import DayCard from "./DayCard";
import type { MealPlanDetail, DayOfWeek } from "./type";

type Prop = {
  mealPlan: MealPlanDetail;
  onAssign: () => void;
};

const days: { key: DayOfWeek; label: string }[] = [
    { key: "Mon", label: "Monday" },
    { key: "Tue", label: "Tuesday" },
    { key: "Wed", label: "Wednesday" },
    { key: "Thu", label: "Thursday" },
    { key: "Fri", label: "Friday" },
    { key: "Sat", label: "Saturday" },
    { key: "Sun", label: "Sunday" },
];




const MealPlanCard = ({ mealPlan, onAssign }: Prop) => {
    return (
        <Card className="w-full border">
            <div>
                <div className="flex">
                    <div className="flex flex-col gap-2 p-4">
                        <h2
                            style={{ fontFamily: "Inter, system-ui" }}
                            className="text-xs font-bold tracking-[2px] text-indigo-500"
                        >
                            SELECTED MEAL PLAN
                        </h2>

                        <p className="text-3xl font-bold">
                            {mealPlan.plan_name.split(" - ")[0]}
                        </p>

                        <div className="w-fit text-gray-400">
                            <p>Full weekly breakdown with meals grouped by day and type.</p>
                        </div>
                    </div>

                    <div className="ml-auto flex gap-2">
                    <Card className="h-25 w-30 border border-gray-300 bg-[#fafaff]">
                        <div className="mx-1 flex flex-col gap-2">
                        <p className="text-xs font-light text-gray-600">Total Calories</p>
                        <p className="text-lg font-bold">{mealPlan.total_calories}</p>
                        </div>
                    </Card>

                    <Card className="h-25 w-30 border border-gray-300 bg-[#fafaff]">
                        <div className="mx-1 flex flex-col gap-2">
                        <p className="text-xs font-light text-gray-600">Meals</p>
                        <p className="text-lg font-bold">{mealPlan.meals.length}</p>
                        </div>
                    </Card>

                    <button
                        onClick={onAssign}
                        className="h-25 px-5 bg-[#5B5EF4] text-white text-sm font-medium rounded-xl hover:bg-[#4B4EE4] transition-colors"
                    >
                        Assign Plan
                    </button>
                    </div>
                </div>

                <div className="w-full">
                    <ScrollShadow className="max-h-[500px] p-4">
                        <div className="space-y-4">

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                {days.map((day) => {
                                    const mealsForDay = mealPlan.meals.filter(
                                        (meal) => meal.day_of_week === day.key
                                    );

                                    return (
                                        <DayCard
                                            key={day.key}
                                            day={day.label}
                                            meals={mealsForDay}
                                        />

                                    );
                                })}
                            </div>

                        </div>
                    </ScrollShadow>
                </div>
            </div>
        </Card>
    );
};

export default MealPlanCard;