import api from "../api";

export const checkSurveyStatus = async () => {
  const res = await api.get("/client/mental-survey/check");

  return res.data.taken_today;
};