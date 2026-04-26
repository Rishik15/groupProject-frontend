import api from "../api";
import type { TodayNutritionSummary } from "../../utils/Interfaces/Nutrition/nutrition";

interface GetNutritionTodayResponse extends TodayNutritionSummary {
  message?: string;
}

export const getNutritionToday = async (): Promise<TodayNutritionSummary> => {
  const response = await api.get<GetNutritionTodayResponse>(
    "/nutrition/getNutritionToday",
  );

  const { calories, macros, meals } = response.data;

  return {
    calories,
    macros,
    meals,
  };
};
