export const predictionQueryKeys = {
  all: ["predictions"] as const,
  summary: () => [...predictionQueryKeys.all, "summary"] as const,
  openMarkets: () => [...predictionQueryKeys.all, "open-markets"] as const,
  completedMarkets: () => [...predictionQueryKeys.all, "completed-markets"] as const,
  leaderboard: () => [...predictionQueryKeys.all, "leaderboard"] as const,
  myBets: () => [...predictionQueryKeys.all, "my-bets"] as const,
  myMarkets: () => [...predictionQueryKeys.all, "my-markets"] as const,
  wallet: () => ["wallet"] as const,
  walletTransactions: () => ["wallet", "transactions"] as const,
  dailyReward: () => ["survey", "daily", "reward"] as const,
  admin: {
    all: ["admin", "predictions"] as const,
    review: () => [...predictionQueryKeys.admin.all, "review"] as const,
    pendingSettlement: () => [...predictionQueryKeys.admin.all, "pending-settlement"] as const,
    cancelReview: () => [...predictionQueryKeys.admin.all, "cancel-review"] as const,
  },
} as const;

export type PredictionQueryKey =
  | ReturnType<typeof predictionQueryKeys.summary>
  | ReturnType<typeof predictionQueryKeys.openMarkets>
  | ReturnType<typeof predictionQueryKeys.completedMarkets>
  | ReturnType<typeof predictionQueryKeys.leaderboard>
  | ReturnType<typeof predictionQueryKeys.myBets>
  | ReturnType<typeof predictionQueryKeys.myMarkets>
  | ReturnType<typeof predictionQueryKeys.wallet>
  | ReturnType<typeof predictionQueryKeys.walletTransactions>
  | ReturnType<typeof predictionQueryKeys.dailyReward>
  | ReturnType<typeof predictionQueryKeys.admin.review>
  | ReturnType<typeof predictionQueryKeys.admin.pendingSettlement>
  | ReturnType<typeof predictionQueryKeys.admin.cancelReview>;