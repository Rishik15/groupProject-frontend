import api from "../../api";

export const getRevenue = async () => {
  const res = await api.get("/dashboard/coach/revenue");
  return res.data;
};