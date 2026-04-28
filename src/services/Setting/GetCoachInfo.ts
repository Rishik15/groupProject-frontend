import api from "../api";

export const GetCoachInfo = async () => {
  const res = await api.post("/coach/profile", {});

  return res.data;
};
