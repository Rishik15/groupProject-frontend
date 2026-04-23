import api from "../api";

export type PredictionDailyReward = {
  already_awarded: boolean;
  points_awarded: number;
  new_balance?: number;
};

type ApiEnvelope<T> = {
  message?: string;
  error?: string;
} & T;

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

const withCredentials = {
  withCredentials: true,
};

const throwIfError = (data: { error?: string }) => {
  if (data.error) {
    throw new Error(data.error);
  }
};

const mapReward = (raw: unknown): PredictionDailyReward => {
  const record = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {};

  return {
    already_awarded: typeof record.already_awarded === "boolean" ? record.already_awarded : false,
    points_awarded: typeof record.points_awarded === "number" ? record.points_awarded : 0,
    new_balance: typeof record.new_balance === "number" ? record.new_balance : undefined,
  };
};

export const rewardDailySurvey = async (): Promise<PredictionDailyReward> => {
  const { data } = await api.post<ApiEnvelope<{ reward?: unknown }>>(
    "/survey/daily/reward",
    {},
    {
      ...withCredentials,
      headers: JSON_HEADERS,
    },
  );

  throwIfError(data);
  return mapReward(data.reward ?? data);
};
