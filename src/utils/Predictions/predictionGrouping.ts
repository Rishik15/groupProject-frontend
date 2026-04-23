import type { PredictionBet, PredictionMarket } from "../Interfaces/Predictions";

export interface GroupedMyBets {
  open: PredictionBet[];
  pending: PredictionBet[];
  closed: PredictionBet[];
}

export interface GroupedMyMarkets {
  inReview: PredictionMarket[];
  open: PredictionMarket[];
  pending: PredictionMarket[];
  closed: PredictionMarket[];
  rejected: PredictionMarket[];
  cancelReview: PredictionMarket[];
}

const byMostRecentDate = <T extends { updated_at?: string | null; created_at?: string | null; end_date?: string | null }>(
  a: T,
  b: T,
): number => {
  const aTime = new Date(a.updated_at ?? a.created_at ?? a.end_date ?? 0).getTime();
  const bTime = new Date(b.updated_at ?? b.created_at ?? b.end_date ?? 0).getTime();
  return bTime - aTime;
};

export const sortMarketsByUrgency = <T extends { end_date?: string | null }>(markets: T[]): T[] => {
  return [...markets].sort((a, b) => {
    const aTime = new Date(a.end_date ?? 0).getTime();
    const bTime = new Date(b.end_date ?? 0).getTime();
    return aTime - bTime;
  });
};

export const sortCompletedByRecent = <T extends { updated_at?: string | null; end_date?: string | null }>(
  markets: T[],
): T[] => {
  return [...markets].sort((a, b) => {
    const aTime = new Date(a.updated_at ?? a.end_date ?? 0).getTime();
    const bTime = new Date(b.updated_at ?? b.end_date ?? 0).getTime();
    return bTime - aTime;
  });
};

export const groupMyBetsByLifecycle = (bets: PredictionBet[]): GroupedMyBets => {
  const grouped: GroupedMyBets = { open: [], pending: [], closed: [] };

  bets.forEach((bet) => {
    const status = bet.market_status;
    if (status === "open") {
      grouped.open.push(bet);
      return;
    }

    if (status === "settled" || status === "cancelled") {
      grouped.closed.push(bet);
      return;
    }

    grouped.pending.push(bet);
  });

  grouped.open.sort(byMostRecentDate);
  grouped.pending.sort(byMostRecentDate);
  grouped.closed.sort(byMostRecentDate);

  return grouped;
};

export const groupMyMarketsByCreatorState = (markets: PredictionMarket[]): GroupedMyMarkets => {
  const grouped: GroupedMyMarkets = {
    inReview: [],
    open: [],
    pending: [],
    closed: [],
    rejected: [],
    cancelReview: [],
  };

  markets.forEach((market) => {
    if (market.cancel_request_status === "pending") {
      grouped.cancelReview.push(market);
      return;
    }

    if (market.review_status === "pending") {
      grouped.inReview.push(market);
      return;
    }

    if (market.review_status === "rejected") {
      grouped.rejected.push(market);
      return;
    }

    if (market.status === "settled" || market.status === "cancelled") {
      grouped.closed.push(market);
      return;
    }

    if (market.status === "closed") {
      grouped.pending.push(market);
      return;
    }

    if (market.review_status === "approved" && market.status === "open") {
      grouped.open.push(market);
      return;
    }

    grouped.inReview.push(market);
  });

  grouped.inReview.sort(byMostRecentDate);
  grouped.open = sortMarketsByUrgency(grouped.open);
  grouped.pending.sort(byMostRecentDate);
  grouped.closed = sortCompletedByRecent(grouped.closed);
  grouped.rejected.sort(byMostRecentDate);
  grouped.cancelReview.sort(byMostRecentDate);

  return grouped;
};
