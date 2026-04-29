import type {
  PredictionCancelRequestStatus,
  PredictionMarketStatus,
  PredictionReviewStatus,
  PredictionSettlementResult,
} from "../Interfaces/Predictions";

const pointFormatter = new Intl.NumberFormat("en-US");
const compactFormatter = new Intl.NumberFormat("en-US", { notation: "compact", maximumFractionDigits: 1 });

export const formatPredictionPoints = (value?: number | null): string => {
  return `${pointFormatter.format(Math.max(0, Math.trunc(value ?? 0)))} pts`;
};

export const formatPredictionCompactPoints = (value?: number | null): string => {
  return `${compactFormatter.format(Math.max(0, value ?? 0))} pts`;
};

export const formatPredictionMultiplier = (value?: number | null): string => {
  if (!value || !Number.isFinite(value) || value <= 0) return "—";
  return `${value.toFixed(2)}x`;
};

export const formatPredictionDate = (value?: string | null): string => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

export const formatTimeLeft = (value?: string | Date | null, now = new Date()): string => {
  if (!value) return "—";
  const target = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(target.getTime())) return "—";
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return "Ended";
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays > 0) return `${diffDays}d left`;
  if (diffHours > 0) return `${diffHours}h left`;
  return `${Math.max(1, diffMinutes)}m left`;
};

export const formatReviewStatusLabel = (status?: PredictionReviewStatus | null): string => {
  switch (status) {
    case "pending":
      return "Pending Review";
    case "approved":
      return "Approved";
    case "rejected":
      return "Rejected";
    default:
      return "Unknown Review";
  }
};

export const formatMarketStatusLabel = (status?: PredictionMarketStatus | null): string => {
  switch (status) {
    case "open":
      return "Open";
    case "closed":
      return "Pending Settlement";
    case "settled":
      return "Settled";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unknown Status";
  }
};

export const formatCancelRequestStatusLabel = (
  status?: PredictionCancelRequestStatus | null,
): string => {
  switch (status) {
    case "none":
      return "No Cancel Request";
    case "pending":
      return "Cancel Review Pending";
    case "approved":
      return "Cancel Approved";
    case "rejected":
      return "Cancel Rejected";
    default:
      return "Unknown Cancel Status";
  }
};

export const formatSettlementResultLabel = (
  result?: PredictionSettlementResult,
): string => {
  switch (result) {
    case "yes":
      return "Yes Won";
    case "no":
      return "No Won";
    case "cancelled":
      return "Cancelled";
    default:
      return "Unsettled";
  }
};
