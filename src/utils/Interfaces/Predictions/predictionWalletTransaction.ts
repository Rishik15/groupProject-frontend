export interface PredictionWalletTransaction {
  txn_id: number;
  user_id?: number;
  delta_points: number;
  reason: string;
  ref_type: string | null;
  ref_id: number | null;
  created_at: string | null;
  updated_at: string | null;
}
