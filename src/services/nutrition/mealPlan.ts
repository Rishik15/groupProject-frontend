import api from "../api";

import type {
  AssignedMealPlan,
  AssignMealPlanPayload,
  CreateMealPlanPayload,
  MealLibraryItem,
  MealPlanDetail,
  MealPlanSummary,
  UpdateMealPlanPayload,
} from "@/utils/Interfaces/Nutrition/mealPlan";

export const getMealPlans = async (): Promise<MealPlanSummary[]> => {
  const res = await api.get("/nutrition/meal-plans");

  return Array.isArray(res.data) ? res.data : (res.data.meal_plans ?? []);
};

export const getMyAssignedMealPlans = async (): Promise<AssignedMealPlan[]> => {
  const res = await api.get("/nutrition/meal-plans/my-plans");

  return Array.isArray(res.data) ? res.data : (res.data.meal_plans ?? []);
};

export const getMealPlanDetail = async (
  mealPlanId: number,
): Promise<MealPlanDetail> => {
  const res = await api.post("/nutrition/meal-plans/detail", {
    meal_plan_id: mealPlanId,
  });

  return res.data;
};

export const assignMealPlan = async (
  payload: AssignMealPlanPayload,
): Promise<{ message: string; meal_plan_id: number }> => {
  const res = await api.post("/nutrition/meal-plans/assign", payload);

  return res.data;
};

export const getMeals = async (): Promise<MealLibraryItem[]> => {
  const res = await api.get("/nutrition/meals");

  return Array.isArray(res.data) ? res.data : (res.data.meals ?? []);
};

export const createMealPlan = async (
  payload: CreateMealPlanPayload,
): Promise<{ message: string; meal_plan_id: number }> => {
  const res = await api.post("/nutrition/meal-plans/create", payload);

  return res.data;
};

export const updateMealPlan = async (
  payload: UpdateMealPlanPayload,
): Promise<{
  message: string;
  meal_plan_id: number;
  total_calories: number;
  deleted: boolean;
}> => {
  const res = await api.put("/nutrition/meal-plans/update", payload);

  return res.data;
};

export const deleteMealPlan = async (
  mealPlanId: number,
): Promise<{ message: string }> => {
  const res = await api.delete("/nutrition/meal-plans/delete", {
    params: {
      meal_plan_id: mealPlanId,
    },
  });

  return res.data;
};
