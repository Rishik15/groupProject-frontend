import type { PredictionBetSide } from "./predictionBet";
import type { PredictionSettlementResult } from "./predictionMarket";

export interface CreatePredictionMarketPayload {
  title: string;
  goal_text: string;
  end_date: string;
}

export interface PlacePredictionBetPayload {
  market_id: number;
  prediction_value: PredictionBetSide;
  points_wagered: number;
}

export interface RequestPredictionCancellationPayload {
  market_id: number;
  reason: string;
}

export interface ClosePredictionMarketPayload {
  market_id: number;
}

export interface ApprovePredictionMarketPayload {
  market_id: number;
  admin_action?: string;
}

export interface RejectPredictionMarketPayload {
  market_id: number;
  admin_action?: string;
}

export interface SettlePredictionMarketPayload {
  market_id: number;
  result: Exclude<PredictionSettlementResult, null>;
  admin_action?: string;
}

export interface ApprovePredictionCancellationPayload {
  market_id: number;
  admin_action?: string;
}

export interface RejectPredictionCancellationPayload {
  market_id: number;
  admin_action?: string;
}
