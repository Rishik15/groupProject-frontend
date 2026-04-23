import type {
  PredictionBetResult,
  PredictionCancelRequestStatus,
  PredictionMarket,
  PredictionMarketStatus,
  PredictionReviewStatus,
  PredictionSettlementResult,
} from "../Interfaces/Predictions";

export type PredictionStatusTone = "primary" | "success" | "warning" | "danger" | "default";

export interface PredictionStatusMeta {
  label: string;
  tone: PredictionStatusTone;
}

const reviewMeta: Record<PredictionReviewStatus, PredictionStatusMeta> = {
  pending: { label: "Pending Review", tone: "warning" },
  approved: { label: "Approved", tone: "success" },
  rejected: { label: "Rejected", tone: "danger" },
};

const marketMeta: Record<PredictionMarketStatus, PredictionStatusMeta> = {
  open: { label: "Open", tone: "primary" },
  closed: { label: "Pending Settlement", tone: "warning" },
  settled: { label: "Settled", tone: "success" },
  cancelled: { label: "Cancelled", tone: "default" },
};

const cancelRequestMeta: Record<PredictionCancelRequestStatus, PredictionStatusMeta> = {
  none: { label: "No Cancel Request", tone: "default" },
  pending: { label: "Cancel Review Pending", tone: "warning" },
  approved: { label: "Cancel Approved", tone: "success" },
  rejected: { label: "Cancel Rejected", tone: "danger" },
};

const settlementMeta: Record<Exclude<PredictionSettlementResult, null>, PredictionStatusMeta> = {
  yes: { label: "Yes Won", tone: "success" },
  no: { label: "No Won", tone: "danger" },
  cancelled: { label: "Cancelled", tone: "default" },
};

const resultMeta: Record<Exclude<PredictionBetResult, null>, PredictionStatusMeta> = {
  won: { label: "Won", tone: "success" },
  lost: { label: "Lost", tone: "danger" },
  refunded: { label: "Refunded", tone: "default" },
  pending: { label: "Pending", tone: "warning" },
};

export const getReviewStatusMeta = (status?: PredictionReviewStatus): PredictionStatusMeta => {
  return status ? reviewMeta[status] : { label: "Unknown Review", tone: "default" };
};

export const getMarketStatusMeta = (status?: PredictionMarketStatus): PredictionStatusMeta => {
  return status ? marketMeta[status] : { label: "Unknown Market State", tone: "default" };
};

export const getCancelRequestStatusMeta = (
  status?: PredictionCancelRequestStatus,
): PredictionStatusMeta => {
  return status ? cancelRequestMeta[status] : cancelRequestMeta.none;
};

export const getSettlementResultMeta = (
  result?: PredictionSettlementResult,
): PredictionStatusMeta => {
  return result ? settlementMeta[result] : { label: "Unsettled", tone: "warning" };
};

export const getBetResultMeta = (status?: PredictionBetResult): PredictionStatusMeta => {
  return status ? resultMeta[status] : { label: "Pending", tone: "warning" };
};

export const isMarketInCancelReview = (
  market: Pick<PredictionMarket, "cancel_request_status">,
): boolean => market.cancel_request_status === "pending";

export const isMarketPendingSettlement = (
  market: Pick<PredictionMarket, "status">,
): boolean => market.status === "closed";

export const isMarketBettable = (
  market: Pick<PredictionMarket, "review_status" | "status">,
): boolean => market.review_status === "approved" && market.status === "open";
