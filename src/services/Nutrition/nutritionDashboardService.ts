import { getLoggedMeals } from "../MealLogging/mealLogService";
import {
  buildTodayNutritionSummary,
  getTodayDateRange,
  normalizeLoggedMeal,
} from "../../utils/Nutrition/nutritionDashboard";
import type { TodayNutritionSummary } from "../../utils/Interfaces/Nutrition/nutrition";

export const getTodayNutritionSummary =
  async (): Promise<TodayNutritionSummary> => {
    const { start_datetime, end_datetime } = getTodayDateRange();

    const loggedMeals = await getLoggedMeals(start_datetime, end_datetime);

    const normalizedMeals = Array.isArray(loggedMeals)
      ? loggedMeals
          .filter((meal) => meal.meal_id !== null)
          .map(normalizeLoggedMeal)
      : [];

    return buildTodayNutritionSummary(normalizedMeals);
  };
