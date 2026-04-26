import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionMarketCard from "../Cards/PredictionMarketCard";
import PredictionEmptyState from "../States/PredictionEmptyState";
import PredictionLoadingState from "../States/PredictionLoadingState";

export interface PredictionMarketGridProps {
    markets?: PredictionMarket[] | null;
    isLoading?: boolean;
    onSelectSide?: (market: PredictionMarket, side: "yes" | "no") => void;
}

export default function PredictionMarketGrid({
    markets,
    isLoading = false,
    onSelectSide,
}: PredictionMarketGridProps) {
    if (isLoading) {
        return <PredictionLoadingState message="Loading open markets…" rows={4} />;
    }

    if (!markets || markets.length === 0) {
        return (
            <PredictionEmptyState
                title="No open markets"
                description="Approved open markets will appear here once they are available for betting."
            />
        );
    }

    return (
        <div className="grid grid-cols-2 gap-2">
            {markets.map((market) => (
                <PredictionMarketCard
                    key={market.market_id}
                    market={market}
                    onSelectSide={onSelectSide}
                />
            ))}
        </div>
    );
}