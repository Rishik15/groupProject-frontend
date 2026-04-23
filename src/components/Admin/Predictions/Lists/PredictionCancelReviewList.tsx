import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionCancelReviewCard from "../Cards/PredictionCancelReviewCard";

export interface PredictionCancelReviewListProps {
    markets: PredictionMarket[];
    pendingMarketId?: number | null;
    onApproveCancel: (market: PredictionMarket) => void;
    onRejectCancel: (market: PredictionMarket) => void;
}

export default function PredictionCancelReviewList({
    markets,
    pendingMarketId,
    onApproveCancel,
    onRejectCancel,
}: PredictionCancelReviewListProps) {
    if (markets.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                No cancellation requests are waiting for review.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {markets.map((market) => (
                <PredictionCancelReviewCard
                    key={market.market_id}
                    market={market}
                    isPending={pendingMarketId === market.market_id}
                    onApproveCancel={onApproveCancel}
                    onRejectCancel={onRejectCancel}
                />
            ))}
        </div>
    );
}