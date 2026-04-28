import api from "../api";

export const submitSurvey = async (payload: {
  mood_score: number;
  notes: string;
}) => {
  const res = await api.post("/client/mental-survey", payload);

  return res.data;
};