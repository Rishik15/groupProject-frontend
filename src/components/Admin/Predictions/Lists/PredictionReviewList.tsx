import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionReviewCard from "../Cards/PredictionReviewCard";

export interface PredictionReviewListProps {
    markets: PredictionMarket[];
    pendingMarketId?: number | null;
    onApprove: (market: PredictionMarket) => void;
    onReject: (market: PredictionMarket) => void;
}

export default function PredictionReviewList({
    markets,
    pendingMarketId,
    onApprove,
    onReject,
}: PredictionReviewListProps) {
    if (markets.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-[13.125px] text-slate-500">
                No markets are waiting for review.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {markets.map((market) => (
                <PredictionReviewCard
                    key={market.market_id}
                    market={market}
                    isPending={pendingMarketId === market.market_id}
                    onApprove={onApprove}
                    onReject={onReject}
                />
            ))}
        </div>
    );
}