import api from "../api";
import type { AdminPrediction } from "../../utils/Interfaces/Predictions/adminPrediction";
import type {
  ApprovePredictionCancellationPayload,
  ApprovePredictionMarketPayload,
  RejectPredictionCancellationPayload,
  RejectPredictionMarketPayload,
  SettlePredictionMarketPayload,
} from "../../utils/Interfaces/Predictions/predictionForms";
import {
  mapAdminPredictions,
  mapPredictionMarket,
} from "../Predictions/predictionMapper";
import type { PredictionMarket } from "../../utils/Interfaces/Predictions/predictionMarket";

type ApiEnvelope<T> = {
  message?: string;
  error?: string;
} & T;

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

const getConfig = (signal?: AbortSignal) => ({
  withCredentials: true,
  signal,
});

const getJsonConfig = (signal?: AbortSignal) => ({
  withCredentials: true,
  signal,
  headers: JSON_HEADERS,
});

const throwIfError = (data: { error?: string }) => {
  if (data.error) {
    throw new Error(data.error);
  }
};

export const getMarketsInReview = async (
  signal?: AbortSignal,
): Promise<AdminPrediction[]> => {
  const { data } = await api.get<
    ApiEnvelope<{ markets?: unknown[]; review?: unknown[] }>
  >("/admin/predictions/review", getConfig(signal));

  throwIfError(data);
  return mapAdminPredictions(data.markets ?? data.review ?? []);
};

export const approvePredictionMarket = async (
  payload: ApprovePredictionMarketPayload,
  signal?: AbortSignal,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/approve",
    payload,
    getJsonConfig(signal),
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const rejectPredictionMarket = async (
  payload: RejectPredictionMarketPayload,
  signal?: AbortSignal,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/reject",
    payload,
    getJsonConfig(signal),
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const getPendingSettlementMarkets = async (
  signal?: AbortSignal,
): Promise<AdminPrediction[]> => {
  const { data } = await api.get<
    ApiEnvelope<{ markets?: unknown[]; pending_settlement?: unknown[] }>
  >("/admin/predictions/pending-settlement", getConfig(signal));

  throwIfError(data);
  return mapAdminPredictions(data.markets ?? data.pending_settlement ?? []);
};

export const settlePredictionMarket = async (
  payload: SettlePredictionMarketPayload,
  signal?: AbortSignal,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/settle",
    payload,
    getJsonConfig(signal),
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const getCancellationReviewMarkets = async (
  signal?: AbortSignal,
): Promise<AdminPrediction[]> => {
  const { data } = await api.get<
    ApiEnvelope<{
      requests?: unknown[];
      markets?: unknown[];
      cancel_review?: unknown[];
    }>
  >("/admin/predictions/cancel-review", getConfig(signal));

  throwIfError(data);
  return mapAdminPredictions(
    data.requests ?? data.markets ?? data.cancel_review ?? [],
  );
};

export const approvePredictionCancellation = async (
  payload: ApprovePredictionCancellationPayload,
  signal?: AbortSignal,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/approve-cancel",
    payload,
    getJsonConfig(signal),
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const rejectPredictionCancellation = async (
  payload: RejectPredictionCancellationPayload,
  signal?: AbortSignal,
): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>(
    "/admin/predictions/reject-cancel",
    payload,
    getJsonConfig(signal),
  );

  throwIfError(data);
  return mapPredictionMarket(data.market);
};
