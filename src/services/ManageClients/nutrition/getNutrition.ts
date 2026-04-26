import api from "@/services/api";
import type { TodayNutritionSummary } from "@/utils/Interfaces/Nutrition/nutrition";

export interface WeeklyDayCalories {
  dayKey: string;
  dayLabel: string;
  calories: number;
}

export interface WeeklyCaloriesSummary {
  days: WeeklyDayCalories[];
  averageDailyCalories: number;
  bestDayCalories: number;
  goalCalories: number | null;
}

interface GetNutritionTodayResponse extends TodayNutritionSummary {
  message?: string;
}

interface GetWeeklyCaloriesSummaryResponse extends WeeklyCaloriesSummary {
  message?: string;
}

export const getTodayNutritionSummary = async (
  contract_id: number,
): Promise<TodayNutritionSummary> => {
  const response = await api.get<GetNutritionTodayResponse>(
    "/manage/nutrition/getNutritionToday",
    {
      params: { contract_id },
    },
  );

  const { calories, macros, meals } = response.data;

  return { calories, macros, meals };
};

export const getWeeklyCaloriesSummary = async (
  contract_id: number,
): Promise<WeeklyCaloriesSummary> => {
  const response = await api.get<GetWeeklyCaloriesSummaryResponse>(
    "/manage/nutrition/getWeeklyCaloriesSummary",
    {
      params: { contract_id },
    },
  );

  const { days, averageDailyCalories, bestDayCalories, goalCalories } =
    response.data;

  return { days, averageDailyCalories, bestDayCalories, goalCalories };
};
