import type { LoggedMeal, TodayNutritionSummary } from "../Interfaces/Nutrition/nutrition";

const DEFAULT_CALORIE_GOAL = 2000;
const DEFAULT_PROTEIN_GOAL = 150;
const DEFAULT_CARBS_GOAL = 200;
const DEFAULT_FATS_GOAL = 65;

const formatLocalDateTime = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

export const getTodayDateRange = () => {
    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    return {
        start_datetime: formatLocalDateTime(start),
        end_datetime: formatLocalDateTime(end),
    };
};

export const normalizeLoggedMeal = (meal: any): LoggedMeal => ({
    log_id: Number(meal.log_id),
    user_id: Number(meal.user_id),
    meal_id: meal.meal_id == null ? null : Number(meal.meal_id),
    food_item_id: meal.food_item_id == null ? null : Number(meal.food_item_id),
    eaten_at: String(meal.eaten_at ?? ""),
    servings: Number(meal.servings ?? 1),
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

export const getMealServings = (meal: LoggedMeal) => Number(meal.servings ?? 1);

export const getMealCalories = (meal: LoggedMeal) =>
    Number(meal.calories ?? 0) * getMealServings(meal);

export const getMealProtein = (meal: LoggedMeal) =>
    Number(meal.protein ?? 0) * getMealServings(meal);

export const getMealCarbs = (meal: LoggedMeal) =>
    Number(meal.carbs ?? 0) * getMealServings(meal);

export const getMealFats = (meal: LoggedMeal) =>
    Number(meal.fats ?? 0) * getMealServings(meal);

export const buildTodayNutritionSummary = (
    meals: LoggedMeal[],
): TodayNutritionSummary => {
    const totals = meals.reduce(
        (acc, meal) => {
            acc.calories += getMealCalories(meal);
            acc.protein += getMealProtein(meal);
            acc.carbs += getMealCarbs(meal);
            acc.fats += getMealFats(meal);
            return acc;
        },
        {
            calories: 0,
            protein: 0,
            carbs: 0,
            fats: 0,
        },
    );

    return {
        meals,
        calories: {
            current: Math.round(totals.calories),
            goal: DEFAULT_CALORIE_GOAL,
        },
        macros: {
            protein: {
                current: Math.round(totals.protein * 10) / 10,
                goal: DEFAULT_PROTEIN_GOAL,
            },
            carbs: {
                current: Math.round(totals.carbs * 10) / 10,
                goal: DEFAULT_CARBS_GOAL,
            },
            fats: {
                current: Math.round(totals.fats * 10) / 10,
                goal: DEFAULT_FATS_GOAL,
            },
        },
    };
};