import api from "../api";

export interface NutritionGoals {
  user_id: number;
  calories_target: number | null;
  protein_target: number | null;
  carbs_target: number | null;
  fat_target: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface SaveNutritionGoalsPayload {
  calories_target?: number | null;
  protein_target?: number | null;
  carbs_target?: number | null;
  fat_target?: number | null;
}

export const getNutritionGoals = async (): Promise<NutritionGoals | null> => {
  const res = await api.get("/nutrition/goals");

  return res.data.goals;
};

export const saveNutritionGoals = async (
  payload: SaveNutritionGoalsPayload,
): Promise<NutritionGoals> => {
  const res = await api.post("/nutrition/goals", payload);

  return res.data.goals;
};
