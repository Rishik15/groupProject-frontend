import type { PredictionMarket } from "../Interfaces/Predictions";
import { isMarketBettable } from "./predictionStatus";

export const canUserBetOnMarket = (
  userId: number | null | undefined,
  market: PredictionMarket,
  currentUserHasBet = false,
): boolean => {
  if (!userId) return false;
  if (!isMarketBettable(market)) return false;
  if (market.creator_user_id === userId) return false;
  if (currentUserHasBet) return false;
  return true;
};

export const canCreatorCloseMarket = (
  userId: number | null | undefined,
  market: PredictionMarket,
): boolean => {
  if (!userId) return false;
  if (market.creator_user_id !== userId) return false;
  return market.review_status === "approved" && market.status === "open";
};

export const canCreatorRequestCancellation = (
  userId: number | null | undefined,
  market: PredictionMarket,
): boolean => {
  if (!userId) return false;
  if (market.creator_user_id !== userId) return false;
  if (market.review_status !== "approved") return false;
  if (market.status !== "open" && market.status !== "closed") return false;
  if (market.settlement_result !== null) return false;
  return market.cancel_request_status !== "pending";
};

export const canAdminSettleMarket = (market: PredictionMarket): boolean => {
  return market.review_status === "approved" && market.status === "closed";
};
