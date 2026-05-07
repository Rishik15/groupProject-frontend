import api from "../api";

export interface StrengthLogPayload {
  session_id: number;
  exercise_id: number;
  set_number: number;
  reps?: number | null;
  weight?: number | null;
  rpe?: number | null;
}

export interface CardioLogPayload {
  session_id?: number | null;
  steps?: number | null;
  distance_km?: number | null;
  duration_min?: number | null;
  calories?: number | null;
  avg_hr?: number | null;
}

export interface UpdateStrengthLogPayload {
  set_number: number;
  reps?: number | null;
  weight?: number | null;
  rpe?: number | null;
}

export interface UpdateCardioLogPayload {
  steps?: number | null;
  distance_km?: number | null;
  duration_min?: number | null;
  calories?: number | null;
  avg_hr?: number | null;
}

export const getActivityLogs = async (sessionId?: number | null) => {
  const res = await api.get("/activity-log/logs", {
    params:
      sessionId !== undefined && sessionId !== null
        ? {
            session_id: sessionId,
          }
        : {},
  });

  return res.data;
};

export const getFullActivityLogs = async () => {
  const res = await api.get("/activity-log/full-logs");

  return res.data;
};

export const logStrengthSet = async (data: StrengthLogPayload) => {
  const res = await api.post("/activity-log/strength", data);

  return res.data;
};

export const logCardioActivity = async (data: CardioLogPayload) => {
  const res = await api.post("/activity-log/cardio", data);

  return res.data;
};

export const updateStrengthSet = async (
  setLogId: number,
  data: UpdateStrengthLogPayload,
) => {
  const res = await api.patch("/activity-log/strength", data, {
    params: {
      set_log_id: setLogId,
    },
  });

  return res.data;
};

export const updateCardioLog = async (
  cardioLogId: number,
  data: UpdateCardioLogPayload,
) => {
  const res = await api.patch("/activity-log/cardio", data, {
    params: {
      cardio_log_id: cardioLogId,
    },
  });

  return res.data;
};
