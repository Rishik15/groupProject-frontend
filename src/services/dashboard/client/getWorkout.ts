import api from "../../api";

export const getWorkoutCompletion = async () => {
  const res = await api.get("/dashboard/client/workout-completion");
  return res.data;
};