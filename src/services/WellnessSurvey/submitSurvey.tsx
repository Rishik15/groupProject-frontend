import api from "../api";

export type SubmitSurveyPayload = {
  mood_score: number;
  notes: string;
  weight?: number | null;
  sleep_hours?: number | null;
};

export const submitSurvey = async (payload: SubmitSurveyPayload) => {
  const res = await api.post("/client/mental-survey", payload, {
    withCredentials: true,
  });

  return res.data;
};
