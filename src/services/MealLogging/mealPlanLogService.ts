import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";

const nutritionApi = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
});

export interface UserMealPlan {
    meal_plan_id: number;
    plan_name: string;
    start_date: string | null;
    end_date: string | null;
    total_calories: number | null;
}

export interface TodayMeal {
    meal_id: number;
    name: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    meal_type: "breakfast" | "lunch" | "dinner" | "snack";
    servings: number;
    day_of_week: string;
}

export const getMyMealPlans = async (): Promise<UserMealPlan[]> => {
    const response = await nutritionApi.get("/nutrition/meal-plans/my-plans");
    return Array.isArray(response.data) ? response.data : [];
};

export const getTodaysMeals = async (meal_plan_id: number): Promise<TodayMeal[]> => {
    const response = await nutritionApi.post("/nutrition/meal-plans/today", {
        meal_plan_id,
    });
    return Array.isArray(response.data) ? response.data : [];
};

export const logMealFromPlan = async (
    meal_id: number,
    servings: number,
    notes: string,
    photoFile: File | null,
): Promise<void> => {
    const formData = new FormData();
    formData.append("meal_id", String(meal_id));
    formData.append("servings", String(servings));
    formData.append("notes", notes);

    if (photoFile) {
        formData.append("photo", photoFile);
    }

    await nutritionApi.post("/nutrition/meal-plans/log-meal", formData);
};