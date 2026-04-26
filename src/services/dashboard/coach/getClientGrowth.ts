import api from "../../api";

export const getClientGrowth = async () => {
  const res = await api.get("/dashboard/coach/clientGrowth");
  return res.data;
};