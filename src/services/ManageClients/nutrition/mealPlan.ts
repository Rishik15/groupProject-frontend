import api from "@/services/api";

import type {
  AssignedMealPlan,
  AssignMealPlanPayload,
  CreateMealPlanPayload,
  MealLibraryItem,
  MealPlanDetail,
  MealPlanSummary,
  UpdateMealPlanPayload,
} from "@/utils/Interfaces/Nutrition/mealPlan";

export const getManageClientMealPlans = async (
  contractId: number,
): Promise<MealPlanSummary[]> => {
  const res = await api.get("/manage/nutrition/meal-plans", {
    params: {
      contract_id: contractId,
    },
  });

  return Array.isArray(res.data) ? res.data : (res.data.meal_plans ?? []);
};

export const getManageClientMealPlanDetail = async (
  contractId: number,
  mealPlanId: number,
): Promise<MealPlanDetail> => {
  const res = await api.get("/manage/nutrition/meal-plans/detail", {
    params: {
      contract_id: contractId,
      meal_plan_id: mealPlanId,
    },
  });

  return res.data;
};

export const getManageClientAssignedMealPlans = async (
  contractId: number,
): Promise<AssignedMealPlan[]> => {
  const res = await api.get("/manage/nutrition/meal-plans/my-plans", {
    params: {
      contract_id: contractId,
    },
  });

  return Array.isArray(res.data) ? res.data : (res.data.meal_plans ?? []);
};

export const createManageClientMealPlan = async (
  contractId: number,
  payload: CreateMealPlanPayload,
): Promise<{ message: string; meal_plan_id: number }> => {
  const res = await api.post("/manage/nutrition/meal-plans/create", payload, {
    params: {
      contract_id: contractId,
    },
  });

  return res.data;
};

export const assignManageClientMealPlan = async (
  contractId: number,
  payload: AssignMealPlanPayload,
): Promise<{ message: string; meal_plan_id: number }> => {
  const res = await api.post("/manage/nutrition/meal-plans/assign", payload, {
    params: {
      contract_id: contractId,
    },
  });

  return res.data;
};

export const updateManageClientMealPlan = async (
  contractId: number,
  payload: UpdateMealPlanPayload,
): Promise<{
  message: string;
  meal_plan_id: number;
  total_calories: number;
  deleted?: boolean;
}> => {
  const res = await api.put("/manage/nutrition/meal-plans/update", payload, {
    params: {
      contract_id: contractId,
    },
  });

  return res.data;
};

export const deleteManageClientMealPlan = async (
  contractId: number,
  mealPlanId: number,
): Promise<{ message: string }> => {
  const res = await api.delete("/manage/nutrition/meal-plans/delete", {
    params: {
      contract_id: contractId,
      meal_plan_id: mealPlanId,
    },
  });

  return res.data;
};

export const getManageClientMeals = async (): Promise<MealLibraryItem[]> => {
  const res = await api.get("/nutrition/meals");

  return Array.isArray(res.data) ? res.data : (res.data.meals ?? []);
};
