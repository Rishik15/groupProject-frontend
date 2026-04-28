import api from "../../api";

export const getCaloriesMetrics = async () => {
  const res = await api.get("/dashboard/client/calories");
  return res.data.weekly;
};