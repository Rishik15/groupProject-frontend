import api from "../../api";

export const getNutrition = async () => {
  const res = await api.get("/dashboard/client/nutrition");
  return res.data;
};