import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";
import PredictionSettlementCard from "../Cards/PredictionSettlementCard";

export interface PredictionSettlementListProps {
    markets: PredictionMarket[];
    pendingMarketId?: number | null;
    onOpenSettlement: (market: PredictionMarket) => void;
}

export default function PredictionSettlementList({
    markets,
    pendingMarketId,
    onOpenSettlement,
}: PredictionSettlementListProps) {
    if (markets.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-500">
                No markets are waiting for settlement.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {markets.map((market) => (
                <PredictionSettlementCard
                    key={market.market_id}
                    market={market}
                    isPending={pendingMarketId === market.market_id}
                    onOpenSettlement={onOpenSettlement}
                />
            ))}
        </div>
    );
}