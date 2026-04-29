import api from "../api";
import type { PredictionWallet } from "../../utils/Interfaces/Predictions/predictionWallet";
import type { PredictionWalletTransaction } from "../../utils/Interfaces/Predictions/predictionWalletTransaction";
import {
  mapPredictionWallet,
  mapPredictionWalletTransactions,
} from "./predictionMapper";

type ApiEnvelope<T> = {
  message?: string;
  error?: string;
} & T;

const withCredentials = {
  withCredentials: true,
};

const throwIfError = (data: { error?: string }, fallbackMessage: string) => {
  if (data.error) {
    throw new Error(data.error);
  }

  return fallbackMessage;
};

export const getWalletSummary = async (): Promise<PredictionWallet> => {
  const { data } = await api.get<ApiEnvelope<{ wallet?: unknown; balance?: number }>>(
    "/wallet",
    withCredentials,
  );

  throwIfError(data, "Failed to load wallet");

  return mapPredictionWallet(data.wallet ?? data);
};

export const getWalletTransactions = async (): Promise<
  PredictionWalletTransaction[]
> => {
  const { data } = await api.get<ApiEnvelope<{ transactions?: unknown[]; txns?: unknown[] }>>(
    "/wallet/transactions",
    withCredentials,
  );

  throwIfError(data, "Failed to load wallet transactions");

  return mapPredictionWalletTransactions(data.transactions ?? data.txns ?? []);
};