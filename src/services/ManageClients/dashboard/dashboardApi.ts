import api from "../../api";

export const getMetrics = async (contractId: number) => {
  const res = await api.get("/manage/dashboard/metrics", {
    params: { contract_id: contractId },
  });

  return res.data;
};

export const getCalories = async (contractId: number) => {
  const res = await api.get("/manage/dashboard/calories", {
    params: { contract_id: contractId },
  });

  return res.data.weekly;
};

export const getNutrition = async (contractId: number) => {
  const res = await api.get("/manage/dashboard/nutrition", {
    params: { contract_id: contractId },
  });

  return res.data;
};

export const getWeight = async (contractId: number) => {
  const res = await api.get("/manage/dashboard/weight", {
    params: { contract_id: contractId },
  });

  return res.data;
};

export const getWorkoutCompletion = async (contractId: number) => {
  const res = await api.get("/manage/dashboard/workout-completion", {
    params: { contract_id: contractId },
  });

  return res.data;
};
