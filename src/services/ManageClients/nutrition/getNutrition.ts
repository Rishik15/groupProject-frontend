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

export interface ManagedNutritionGoals {
  user_id?: number;
  calories_target: number | null;
  protein_target: number | null;
  carbs_target: number | null;
  fat_target: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface SaveManagedNutritionGoalsInput {
  calories_target: number | null;
  protein_target: number | null;
  carbs_target: number | null;
  fat_target: number | null;
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

export const getManagedNutritionGoals = async (
  contract_id: number,
): Promise<ManagedNutritionGoals | null> => {
  const response = await api.get<{ goals: ManagedNutritionGoals | null }>(
    "/manage/nutrition/goals",
    {
      params: { contract_id },
    },
  );

  return response.data.goals;
};

export const saveManagedNutritionGoals = async (
  contract_id: number,
  input: SaveManagedNutritionGoalsInput,
): Promise<ManagedNutritionGoals> => {
  const response = await api.patch<{ goals: ManagedNutritionGoals }>(
    "/manage/nutrition/goals",
    input,
    {
      params: { contract_id },
    },
  );

  return response.data.goals;
};
