import { getLoggedMeals } from "../MealLogging/mealLogService";
import type { LoggedMeal } from "../../utils/Interfaces/Nutrition/nutrition";
import {
    buildWeeklyCaloriesSummary,
    getCurrentWeekDateRange,
    type WeeklyCaloriesSummary,
} from "../../utils/Nutrition/nutritionWeek";

const normalizeLoggedMeal = (meal: any): LoggedMeal => ({
    log_id: Number(meal.log_id),
    user_id: Number(meal.user_id),
    meal_id: meal.meal_id == null ? null : Number(meal.meal_id),
    food_item_id: meal.food_item_id == null ? null : Number(meal.food_item_id),
    eaten_at: String(meal.eaten_at ?? ""),
    servings: Number(meal.servings ?? 0),
    notes: meal.notes ?? null,
    photo_url: String(meal.photo_url ?? ""),
    created_at: String(meal.created_at ?? ""),
    updated_at: String(meal.updated_at ?? ""),
    meal_name: String(meal.meal_name ?? ""),
    calories: Number(meal.calories ?? 0),
    protein: Number(meal.protein ?? 0),
    carbs: Number(meal.carbs ?? 0),
    fats: Number(meal.fats ?? 0),
});

export const getWeeklyCaloriesSummary =
    async (): Promise<WeeklyCaloriesSummary> => {
        const { start_datetime, end_datetime } = getCurrentWeekDateRange();

        const loggedMeals = await getLoggedMeals(start_datetime, end_datetime);

        const normalizedMeals = Array.isArray(loggedMeals)
            ? loggedMeals.map(normalizeLoggedMeal)
            : [];

        return buildWeeklyCaloriesSummary(normalizedMeals);
    };