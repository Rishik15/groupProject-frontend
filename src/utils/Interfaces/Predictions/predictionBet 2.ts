export type PredictionBetSide = "yes" | "no";
export type PredictionBetResult = "won" | "lost" | "refunded" | "pending" | null;

export interface PredictionBet {
  prediction_id: number;
  market_id: number;
  predictor_user_id: number;
  prediction_value: PredictionBetSide;
  points_wagered: number;
  market_title: string | null;
  goal_text: string | null;
  end_date: string | null;
  market_status: string | null;
  created_at: string | null;
  updated_at: string | null;
  projected_payout?: number;
  final_payout?: number;
  result?: PredictionBetResult;
}
