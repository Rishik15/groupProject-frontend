import { Tabs } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import CalorieCount from "./Today/CalorieCount";
import Macros from "./Today/Macros";
import MealsToday from "./Today/MealsToday";
import WeeklyCalories from "./Week/WeeklyCalories";
import MealPlan from "./MealPlan/MealPlan";
import CreateMealPlan from "./MealPlan/CreateMealPlan";
import AssignedPlans from "./MealPlan/AssignedPlans";
import type { TodayNutritionSummary } from "../../utils/Interfaces/Nutrition/nutrition";
import {
  getWeeklyCaloriesSummary,
  type WeeklyCaloriesSummary,
} from "../../services/nutrition/getWeeklyCaloriesSummary";
import { getNutritionToday } from "../../services/nutrition/getNutritionToday";

interface NutritionTabsProps {
  refreshKey?: number;
}

type PlansSubTab = "meal-plans" | "assigned-plans" | "create-plan";

const NutritionTabs = ({ refreshKey = 0 }: NutritionTabsProps) => {
  const [todaySummary, setTodaySummary] =
    useState<TodayNutritionSummary | null>(null);

  const [weeklySummary, setWeeklySummary] =
    useState<WeeklyCaloriesSummary | null>(null);

  const [isTodayLoading, setIsTodayLoading] = useState(true);
  const [isWeeklyLoading, setIsWeeklyLoading] = useState(true);

  const [activeSubTab, setActiveSubTab] = useState<PlansSubTab>("meal-plans");

  const fetchNutritionData = useCallback(async () => {
    try {
      setIsTodayLoading(true);
      setIsWeeklyLoading(true);

      const [todayData, weeklyData] = await Promise.all([
        getNutritionToday(),
        getWeeklyCaloriesSummary(),
      ]);

      setTodaySummary(todayData);
      setWeeklySummary(weeklyData);
    } catch (error) {
      console.error("Failed to load nutrition data", error);
      setTodaySummary(null);
      setWeeklySummary(null);
    } finally {
      setIsTodayLoading(false);
      setIsWeeklyLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNutritionData();
  }, [fetchNutritionData, refreshKey]);

  const calorieCurrent = todaySummary?.calories.current ?? 0;
  const calorieGoal = todaySummary?.calories.goal ?? null;

  const protein = todaySummary?.macros.protein ?? { current: 0, goal: null };
  const carbs = todaySummary?.macros.carbs ?? { current: 0, goal: null };
  const fats = todaySummary?.macros.fats ?? { current: 0, goal: null };

  const todayMeals = todaySummary?.meals ?? [];

  return (
    <div className="mx-auto flex w-full flex-col gap-4 py-4">
      <div className="w-full flex justify-center">
        <Tabs className="w-full">
          <Tabs.ListContainer>
            <Tabs.List
              aria-label="Nutrition tabs"
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
              <MealsToday meals={todayMeals} isLoading={isTodayLoading} />
            </div>
          </Tabs.Panel>

          <Tabs.Panel className="mt-5 pt-0 pl-0 pr-0" id="This Week">
            <WeeklyCalories
              summary={weeklySummary}
              isLoading={isWeeklyLoading}
            />
          </Tabs.Panel>

          <Tabs.Panel className="mt-5 pt-0 pl-0 pr-0" id="Meal Plans">
            <div className="mb-4 flex gap-2">
              <button
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeSubTab === "meal-plans"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-neutral-100 text-neutral-500"
                }`}
                onClick={() => setActiveSubTab("meal-plans")}
              >
                Meal Plans
              </button>

              <button
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeSubTab === "assigned-plans"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-neutral-100 text-neutral-500"
                }`}
                onClick={() => setActiveSubTab("assigned-plans")}
              >
                My Plans
              </button>

              <button
                className={`rounded-full px-4 py-2 text-sm font-medium ${
                  activeSubTab === "create-plan"
                    ? "bg-indigo-100 text-indigo-600"
                    : "bg-neutral-100 text-neutral-500"
                }`}
                onClick={() => setActiveSubTab("create-plan")}
              >
                Create Plan
              </button>
            </div>

            {activeSubTab === "meal-plans" && <MealPlan />}
            {activeSubTab === "assigned-plans" && <AssignedPlans />}
            {activeSubTab === "create-plan" && <CreateMealPlan />}
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default NutritionTabs;
