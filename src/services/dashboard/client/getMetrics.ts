import api from "../../api";

export const getMetrics = async () => {
  const res = await api.get("/dashboard/client/metrics");
  return res.data;
};