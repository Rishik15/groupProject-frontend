import api from "../api";

export const getTodayScheduledSessions = async () => {
  const res = await api.get("/sessions/scheduled-today");
  return res.data;
};

export const getActiveSession = async () => {
  const res = await api.get("/sessions/active");
  return res.data;
};

export const startScheduledSession = async (eventId: number) => {
  const res = await api.post("/sessions/start-scheduled", {
    event_id: eventId,
  });

  return res.data;
};

export const getSessionExercises = async (sessionId: number) => {
  const res = await api.get("/sessions/session-exercises", {
    params: {
      session_id: sessionId,
    },
  });

  return res.data;
};

export const finishSession = async (sessionId: number) => {
  const res = await api.patch("/sessions/finish", {
    session_id: sessionId,
  });

  return res.data;
};
