import api from "../api";
import type { AdminPrediction } from "../../utils/Interfaces/Predictions/adminPrediction";
import type {
  ApprovePredictionCancellationPayload,
  ApprovePredictionMarketPayload,
  RejectPredictionCancellationPayload,
  RejectPredictionMarketPayload,
  SettlePredictionMarketPayload,
} from "../../utils/Interfaces/Predictions/predictionForms";
import { mapAdminPredictions, mapPredictionMarket } from "../Predictions/predictionMapper";
import type { PredictionMarket } from "../../utils/Interfaces/Predictions/predictionMarket";

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

export const getMarketsInReview = async (): Promise<AdminPrediction[]> => {
  const { data } = await api.get<ApiEnvelope<{ markets?: unknown[]; review?: unknown[] }>>(
    "/admin/predictions/review",
    withCredentials,
  );

  throwIfError(data);
  return mapAdminPredictions(data.markets ?? data.review ?? []);
};

export const approvePredictionMarket = async (
  payload: ApprovePredictionMarketPayload,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/approve",
    payload,
    {
      ...withCredentials,
      headers: JSON_HEADERS,
    },
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const rejectPredictionMarket = async (
  payload: RejectPredictionMarketPayload,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/reject",
    payload,
    {
      ...withCredentials,
      headers: JSON_HEADERS,
    },
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const getPendingSettlementMarkets = async (): Promise<AdminPrediction[]> => {
  const { data } = await api.get<ApiEnvelope<{ markets?: unknown[]; pending_settlement?: unknown[] }>>(
    "/admin/predictions/pending-settlement",
    withCredentials,
  );

  throwIfError(data);
  return mapAdminPredictions(data.markets ?? data.pending_settlement ?? []);
};

export const settlePredictionMarket = async (
  payload: SettlePredictionMarketPayload,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/settle",
    payload,
    {
      ...withCredentials,
      headers: JSON_HEADERS,
    },
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const getCancellationReviewMarkets = async (): Promise<AdminPrediction[]> => {
  const { data } = await api.get<
    ApiEnvelope<{ requests?: unknown[]; markets?: unknown[]; cancel_review?: unknown[] }>
  >("/admin/predictions/cancel-review", withCredentials);

  throwIfError(data);
  return mapAdminPredictions(data.requests ?? data.markets ?? data.cancel_review ?? []);
};

export const approvePredictionCancellation = async (
  payload: ApprovePredictionCancellationPayload,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/approve-cancel",
    payload,
    {
      ...withCredentials,
      headers: JSON_HEADERS,
    },
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const rejectPredictionCancellation = async (
  payload: RejectPredictionCancellationPayload,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/reject-cancel",
    payload,
    {
      ...withCredentials,
      headers: JSON_HEADERS,
    },
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};
