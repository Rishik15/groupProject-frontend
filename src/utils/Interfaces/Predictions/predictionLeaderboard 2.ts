export interface PredictionLeaderboardEntry {
  user_id: number;
  name: string;
  balance: number;
  rank?: number;
  win_rate?: number;
  points_won?: number;
}
