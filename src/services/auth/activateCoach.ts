import api from "../api";

export const activateCoachMode = async () => {
  const response = await api.post("/coach/activate-coach-mode");
  return response.data;
};