import api from "../../api";

export const getWeight = async () => {
  const res = await api.get("/dashboard/client/weight");
  return res.data;
};