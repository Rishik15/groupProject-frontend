import api from "../../api";

export const getCoachMetrics = async () => {
  const res = await api.get("/dashboard/coach/metric");
  return res.data;
};