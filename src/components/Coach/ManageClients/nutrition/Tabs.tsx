import { Tabs } from "@heroui/react";
import { useCallback, useEffect, useState } from "react";
import CalorieCount from "./Today/CalorieCount";
import Macros from "./Today/Macros";
import MealsToday from "./Today/MealsToday";
import WeeklyCalories from "./Week/WeeklyCalories";
import type { TodayNutritionSummary } from "@/utils/Interfaces/Nutrition/nutrition";
import {
  getTodayNutritionSummary,
  getWeeklyCaloriesSummary,
  type WeeklyCaloriesSummary,
} from "@/services/ManageClients/nutrition/getNutrition";
import { socket } from "@/services/sockets/socket";

interface NutritionTabsProps {
  contract_Id: number;
  refreshKey?: number;
}

const NutritionTabs = ({ contract_Id, refreshKey = 0 }: NutritionTabsProps) => {
  const [todaySummary, setTodaySummary] =
    useState<TodayNutritionSummary | null>(null);

  const [weeklySummary, setWeeklySummary] =
    useState<WeeklyCaloriesSummary | null>(null);

  const [isTodayLoading, setIsTodayLoading] = useState(true);
  const [isWeeklyLoading, setIsWeeklyLoading] = useState(true);

  const fetchNutritionData = useCallback(async () => {
    if (!contract_Id) return;

    try {
      setIsTodayLoading(true);
      setIsWeeklyLoading(true);

      const [todayData, weeklyData] = await Promise.all([
        getTodayNutritionSummary(contract_Id),
        getWeeklyCaloriesSummary(contract_Id),
      ]);

      setTodaySummary(todayData);
      setWeeklySummary(weeklyData);
    } catch (error) {
      console.error("Failed to load managed nutrition data", error);
      setTodaySummary(null);
      setWeeklySummary(null);
    } finally {
      setIsTodayLoading(false);
      setIsWeeklyLoading(false);
    }
  }, [contract_Id]);

  useEffect(() => {
    fetchNutritionData();
  }, [fetchNutritionData, refreshKey]);

  useEffect(() => {
    const handleUpdate = () => {
      fetchNutritionData();
    };

    socket.on("nutrition_updated", handleUpdate);

    return () => {
      socket.off("nutrition_updated", handleUpdate);
    };
  }, [fetchNutritionData]);

  const calorieCurrent = todaySummary?.calories.current ?? 0;
  const calorieGoal = todaySummary?.calories.goal ?? null;

  const protein = todaySummary?.macros.protein ?? { current: 0, goal: null };
  const carbs = todaySummary?.macros.carbs ?? { current: 0, goal: null };
  const fats = todaySummary?.macros.fats ?? { current: 0, goal: null };

  const todayMeals = todaySummary?.meals ?? [];

  return (
    <div className="mx-auto flex w-full flex-col gap-4 py-4">
      <div className="flex w-full justify-center">
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

          <Tabs.Panel className="mt-5 p-0" id="Today">
            <div className="flex w-full gap-6">
              <CalorieCount Current={calorieCurrent} Goal={calorieGoal} />
              <Macros protein={protein} carbs={carbs} fats={fats} />
            </div>

            <div className="mt-6">
              <MealsToday meals={todayMeals} isLoading={isTodayLoading} />
            </div>
          </Tabs.Panel>

          <Tabs.Panel className="mt-5 p-0" id="This Week">
            <WeeklyCalories
              summary={weeklySummary}
              isLoading={isWeeklyLoading}
            />
          </Tabs.Panel>

          <Tabs.Panel className="mt-5 p-0" id="Meal Plans">
            <div className="rounded-2xl border border-dashed border-neutral-300 bg-white p-6" />
          </Tabs.Panel>
        </Tabs>
      </div>
    </div>
  );
};

export default NutritionTabs;
