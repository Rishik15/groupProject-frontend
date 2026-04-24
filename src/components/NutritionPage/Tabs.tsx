import { Tabs } from "@heroui/react";
import { useEffect, useState } from "react";
import CalorieCount from "./Today/CalorieCount";
import Macros from "./Today/Macros";
import MealsToday from "./Today/MealsToday";
import WeeklyCalories from "./Week/WeeklyCalories";
import type { TodayNutritionSummary } from "../../utils/Interfaces/Nutrition/nutrition";
import { getTodayNutritionSummary } from "../../services/Nutrition/nutritionDashboardService";
import MealPlan from "./MealPlan/MealPlan";

const NutritionTabs = () => {
    const [summary, setSummary] = useState<TodayNutritionSummary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTodayNutrition = async () => {
            try {
                const data = await getTodayNutritionSummary();
                setSummary(data);
            } catch (error) {
                console.error("Failed to load today nutrition summary", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTodayNutrition();
    }, []);

    const calorieCurrent = summary?.calories.current ?? 0;
    const calorieGoal = summary?.calories.goal ?? 2000;

    const protein = summary?.macros.protein ?? { current: 0, goal: 150 };
    const carbs = summary?.macros.carbs ?? { current: 0, goal: 200 };
    const fats = summary?.macros.fats ?? { current: 0, goal: 65 };

    const todayMeals = summary?.meals ?? [];

    return (
        <div className="mx-auto flex w-full flex-col gap-4 py-4">
            <div className="w-full flex justify-center">
                <Tabs className="w-full">
                    <Tabs.ListContainer>
                        <Tabs.List
                            aria-label="Today"
                            className="inline-flex w-fit items-center gap-1 rounded-full bg-transparent p-0"
                        >
                            <Tabs.Tab
                                id="Today"
                                className="whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium text-black"
                            >
                                Today
                                <Tabs.Indicator />
                            </Tabs.Tab>

                            <Tabs.Tab
                                id="This Week"
                                className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-medium text-black"
                            >
                                This Week
                                <Tabs.Indicator />
                            </Tabs.Tab>

                            <Tabs.Tab
                                id="Meal Plans"
                                className="whitespace-nowrap rounded-full px-2 py-2 text-sm font-medium text-black"
                            >
                                Meal Plans
                                <Tabs.Indicator />
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs.ListContainer>

                    <Tabs.Panel className="mt-5 pt-0 pl-0 pr-0" id="Today">
                        <div className="flex w-full gap-6">
                            <CalorieCount Current={calorieCurrent} Goal={calorieGoal} />
                            <Macros protein={protein} carbs={carbs} fats={fats} />
                        </div>

                        <div className="mt-6">
                            <MealsToday meals={todayMeals} isLoading={isLoading} />
                        </div>
                    </Tabs.Panel>

                    <Tabs.Panel className="mt-5 pt-0 pl-0 pr-0" id="This Week">
                        <WeeklyCalories />
                    </Tabs.Panel>

                    <Tabs.Panel className="mt-5 pt-0 pl-0 pr-0" id="Meal Plans">
                        <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6">
                            <MealPlan/>
                        </div>
                    </Tabs.Panel>
                </Tabs>
            </div>
        </div>
    );
};

export default NutritionTabs;