import api from "@/services/api";
import {
  buildTodayNutritionSummary,
  getTodayDateRange,
  normalizeLoggedMeal,
} from "@/utils/Nutrition/nutritionDashboard";
import { buildWeeklyCaloriesSummary } from "@/utils/Nutrition/nutritionWeek";

import { getCurrentWeekDateRange } from "@/utils/Nutrition/nutritionWeek";

import type { TodayNutritionSummary } from "@/utils/Interfaces/Nutrition/nutrition";

const buildBackendMediaUrl = (photoUrl?: string | null): string | null => {
  if (!photoUrl) return null;

  if (/^https?:\/\//i.test(photoUrl)) {
    return photoUrl;
  }

  return `http://localhost:8080${photoUrl.startsWith("/") ? "" : "/"}${photoUrl}`;
};

export const getLoggedMeals = async (
  contract_id: number,
  start_datetime?: string,
  end_datetime?: string,
) => {
  const response = await api.get("/manage/nutrition/getLoggedMeals", {
    params: {
      contract_id,
      start_datetime,
      end_datetime,
    },
  });

  const meals = response.data?.loggedMeals ?? [];

  return meals.map((meal: any) => ({
    ...meal,
    photo_url: buildBackendMediaUrl(meal.photo_url ?? null),
  }));
};

export const getTodayNutritionSummary = async (
  contract_id: number,
): Promise<TodayNutritionSummary> => {
  const { start_datetime, end_datetime } = getTodayDateRange();

  const meals = await getLoggedMeals(contract_id, start_datetime, end_datetime);

  const normalizedMeals = Array.isArray(meals)
    ? meals.map(normalizeLoggedMeal)
    : [];

  return buildTodayNutritionSummary(normalizedMeals);
};

export const getWeeklyCaloriesSummary = async (contract_id: number) => {
  const { start_datetime, end_datetime } = getCurrentWeekDateRange();

  const meals = await getLoggedMeals(contract_id, start_datetime, end_datetime);

  const normalizedMeals = Array.isArray(meals)
    ? meals.map(normalizeLoggedMeal)
    : [];

  return buildWeeklyCaloriesSummary(normalizedMeals);
};
