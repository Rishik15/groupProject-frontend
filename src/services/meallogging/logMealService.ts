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

export interface LogFoodItemInput {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  servings: number;
  eaten_at: string;
  notes?: string;
  photoFile?: File | null;
}

export interface LogMealFromPlanInput {
  meal_id: number;
  servings: number;
  eaten_at: string;
  notes?: string;
  photoFile?: File | null;
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

export const logFoodItem = async ({
  name,
  calories,
  protein,
  carbs,
  fats,
  servings,
  eaten_at,
  notes = "",
  photoFile = null,
}: LogFoodItemInput) => {
  const formData = new FormData();

  formData.append("name", name.trim());
  formData.append("calories", String(calories));
  formData.append("protein", String(protein));
  formData.append("carbs", String(carbs));
  formData.append("fats", String(fats));
  formData.append("servings", String(servings));
  formData.append("eaten_at", eaten_at);
  formData.append("notes", notes.trim());

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  const response = await api.post("/nutrition/log-food-item", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const logMealFromPlan = async ({
  meal_id,
  servings,
  eaten_at,
  notes = "",
  photoFile = null,
}: LogMealFromPlanInput) => {
  const formData = new FormData();

  formData.append("meal_id", String(meal_id));
  formData.append("servings", String(servings));
  formData.append("eaten_at", eaten_at);
  formData.append("notes", notes.trim());

  if (photoFile) {
    formData.append("photo", photoFile);
  }

  const response = await api.post("/nutrition/meal-plans/log-meal", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};
