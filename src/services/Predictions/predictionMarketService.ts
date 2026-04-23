import api from "../api";
import type { PredictionBet } from "../../utils/Interfaces/Predictions/predictionBet";
import type { PredictionLeaderboardEntry } from "../../utils/Interfaces/Predictions/predictionLeaderboard";
import type { PredictionMarket } from "../../utils/Interfaces/Predictions/predictionMarket";
import type {
  ClosePredictionMarketPayload,
  CreatePredictionMarketPayload,
  PlacePredictionBetPayload,
  RequestPredictionCancellationPayload,
} from "../../utils/Interfaces/Predictions/predictionForms";
import type { PredictionSummary } from "../../utils/Interfaces/Predictions/predictionSummary";
import {
  mapPredictionBet,
  mapPredictionBets,
  mapPredictionLeaderboard,
  mapPredictionMarket,
  mapPredictionMarkets,
  mapPredictionSummary,
} from "./predictionMapper";

type ApiEnvelope<T> = {
  message?: string;
  error?: string;
} & T;

type CancelRequestResponse = {
  market_id: number;
  status: string;
  reason?: string;
};

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

export const getPredictionSummary = async (): Promise<PredictionSummary> => {
  const { data } = await api.get<ApiEnvelope<{ summary: unknown }>>("/predictions/summary", withCredentials);
  throwIfError(data);
  return mapPredictionSummary(data.summary);
};

export const getOpenMarkets = async (): Promise<PredictionMarket[]> => {
  const { data } = await api.get<ApiEnvelope<{ markets: unknown[] }>>("/predictions/markets/open", withCredentials);
  throwIfError(data);
  return mapPredictionMarkets(data.markets);
};

export const getCompletedMarkets = async (): Promise<PredictionMarket[]> => {
  const { data } = await api.get<ApiEnvelope<{ markets: unknown[] }>>("/predictions/completed", withCredentials);
  throwIfError(data);
  return mapPredictionMarkets(data.markets);
};

export const getLeaderboard = async (): Promise<PredictionLeaderboardEntry[]> => {
  const { data } = await api.get<ApiEnvelope<{ leaderboard: unknown[] }>>("/predictions/leaderboard", withCredentials);
  throwIfError(data);
  return mapPredictionLeaderboard(data.leaderboard);
};

export const getMyBets = async (): Promise<PredictionBet[]> => {
  const { data } = await api.get<ApiEnvelope<{ bets: unknown[] }>>("/predictions/me/bets", withCredentials);
  throwIfError(data);
  return mapPredictionBets(data.bets);
};

export const getMyMarkets = async (): Promise<PredictionMarket[]> => {
  const { data } = await api.get<ApiEnvelope<{ markets: unknown[] }>>("/predictions/me/markets", withCredentials);
  throwIfError(data);
  return mapPredictionMarkets(data.markets);
};

export const createMarket = async (payload: CreatePredictionMarketPayload): Promise<PredictionMarket> => {
  const { data } = await api.post<ApiEnvelope<{ market: unknown }>>("/predictions/markets", payload, {
    ...withCredentials,
    headers: JSON_HEADERS,
  });

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const placeBet = async (payload: PlacePredictionBetPayload): Promise<PredictionBet> => {
  const { data } = await api.post<ApiEnvelope<{ bet: unknown }>>("/predictions/bets", payload, {
    ...withCredentials,
    headers: JSON_HEADERS,
  });

  throwIfError(data);
  return mapPredictionBet(data.bet);
};

export const closeMarket = async (payload: ClosePredictionMarketPayload): Promise<PredictionMarket> => {
  const { data } = await api.patch<ApiEnvelope<{ market: unknown }>>("/predictions/markets/close", payload, {
    ...withCredentials,
    headers: JSON_HEADERS,
  });

  throwIfError(data);
  return mapPredictionMarket(data.market);
};

export const requestMarketCancellation = async (
  payload: RequestPredictionCancellationPayload,
): Promise<CancelRequestResponse> => {
  const { data } = await api.patch<ApiEnvelope<{ cancel_request: CancelRequestResponse }>>(
    "/predictions/markets/cancel-request",
    payload,
    {
      ...withCredentials,
      headers: JSON_HEADERS,
    },
  );

  throwIfError(data);
  return data.cancel_request;
};
