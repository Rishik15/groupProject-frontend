import api from "../api";

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
  const response = await api.get("/nutrition/meal-plans/my-plans");
  return Array.isArray(response.data) ? response.data : [];
};

export const getTodaysMeals = async (
  meal_plan_id: number,
): Promise<TodayMeal[]> => {
  const response = await api.post("/nutrition/meal-plans/today", {
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

  await api.post("/nutrition/meal-plans/log-meal", formData);
};
