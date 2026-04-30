import type {
  PredictionCancelRequestStatus,
  PredictionMarketStatus,
  PredictionReviewStatus,
  PredictionSettlementResult,
} from "./predictionMarket";

export type PredictionAdminTabState = "review" | "settlement" | "cancel-review" | "history";

export interface AdminPredictionItem {
  yes_bets: number;
  no_bets: number;
  yes_points: number;
  no_points: number;
  market_id: number;
  creator_name: string;
  creator_email: string | null;
  title: string;
  goal_text: string;
  end_date: string;
  status: PredictionMarketStatus;
  review_status: PredictionReviewStatus;
  cancel_request_status: PredictionCancelRequestStatus;
  settlement_result: PredictionSettlementResult;
  total_bets: number;
  total_points: number;
  review_note: string | null;
  settlement_note: string | null;
  cancel_request_reason: string | null;
  cancel_review_note: string | null;
  created_at: string | null;
  updated_at: string | null;
}

export type AdminPrediction = AdminPredictionItem;
