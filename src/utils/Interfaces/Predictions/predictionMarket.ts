export type PredictionReviewStatus = "approved" | "pending" | "rejected";
export type PredictionMarketStatus = "open" | "closed" | "settled" | "cancelled";
export type PredictionSettlementResult = "yes" | "no" | "cancelled" | null;
export type PredictionCancelRequestStatus = "none" | "pending" | "approved" | "rejected";
export type PredictionResult = "yes" | "no" | "cancelled" | null;

export interface PredictionMarket {
  market_id: number;
  creator_user_id: number;
  creator_name: string;
  creator_email: string;
  title: string;
  goal_text: string;
  end_date: string;
  status: PredictionMarketStatus;
  review_status: PredictionReviewStatus;
  reviewed_by_admin_id: number | null;
  reviewed_at: string | null;
  review_note: string | null;
  settlement_result: PredictionSettlementResult;
  settled_by_admin_id: number | null;
  settled_at: string | null;
  settlement_note: string | null;
  cancel_request_status: PredictionCancelRequestStatus;
  cancel_request_reason: string | null;
  cancel_requested_at: string | null;
  cancel_reviewed_by_admin_id: number | null;
  cancel_reviewed_at: string | null;
  cancel_review_note: string | null;
  result: PredictionResult;
  yes_bets: number;
  no_bets: number;
  yes_points: number;
  no_points: number;
  total_bets: number;
  total_points: number;
  created_at: string | null;
  updated_at: string | null;
}
