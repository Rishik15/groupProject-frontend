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

const TIMEZONE_FIELDS = ["performedAt", "startedAt", "endedAt"];

const getLocalTodayUtcRange = () => {
  const now = new Date();

  const localStart = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0,
  );

  const localEnd = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
    0,
    0,
    0,
    0,
  );

  return {
    today_start_utc: localStart.toISOString(),
    today_end_utc: localEnd.toISOString(),
  };
};

const normalizeUtcDateTime = (value: string) => {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return value;
  }

  if (trimmedValue.endsWith("Z") || /[+-]\d{2}:\d{2}$/.test(trimmedValue)) {
    return trimmedValue;
  }

  return `${trimmedValue.replace(" ", "T")}Z`;
};

const convertUtcToLocalDateTime = (value: string) => {
  const date = new Date(normalizeUtcDateTime(value));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);

  return localDate.toISOString().slice(0, 19);
};

const convertActivityLogTimesToLocal = <T>(data: T): T => {
  if (Array.isArray(data)) {
    return data.map((item) => convertActivityLogTimesToLocal(item)) as T;
  }

  if (data !== null && typeof data === "object") {
    const convertedData: Record<string, unknown> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (typeof value === "string" && TIMEZONE_FIELDS.includes(key)) {
        convertedData[key] = convertUtcToLocalDateTime(value);
      } else {
        convertedData[key] = convertActivityLogTimesToLocal(value);
      }
    });

    return convertedData as T;
  }

  return data;
};

export const getActivityLogs = async (sessionId?: number | null) => {
  const todayRange = getLocalTodayUtcRange();

  const res = await api.get("/activity-log/logs", {
    params:
      sessionId !== undefined && sessionId !== null
        ? {
            session_id: sessionId,
            ...todayRange,
          }
        : {
            ...todayRange,
          },
  });

  return convertActivityLogTimesToLocal(res.data);
};

export const getFullActivityLogs = async () => {
  const todayRange = getLocalTodayUtcRange();

  const res = await api.get("/activity-log/full-logs", {
    params: {
      ...todayRange,
    },
  });

  return convertActivityLogTimesToLocal(res.data);
};

export const logStrengthSet = async (data: StrengthLogPayload) => {
  const res = await api.post("/activity-log/strength", data);

  return convertActivityLogTimesToLocal(res.data);
};

export const logCardioActivity = async (data: CardioLogPayload) => {
  const res = await api.post("/activity-log/cardio", data);

  return convertActivityLogTimesToLocal(res.data);
};

export const updateStrengthSet = async (
  setLogId: number,
  data: UpdateStrengthLogPayload,
) => {
  const todayRange = getLocalTodayUtcRange();

  const res = await api.patch("/activity-log/strength", data, {
    params: {
      set_log_id: setLogId,
      ...todayRange,
    },
  });

  return convertActivityLogTimesToLocal(res.data);
};

export const updateCardioLog = async (
  cardioLogId: number,
  data: UpdateCardioLogPayload,
) => {
  const todayRange = getLocalTodayUtcRange();

  const res = await api.patch("/activity-log/cardio", data, {
    params: {
      cardio_log_id: cardioLogId,
      ...todayRange,
    },
  });

  return convertActivityLogTimesToLocal(res.data);
};
