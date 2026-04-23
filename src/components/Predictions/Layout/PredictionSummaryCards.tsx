import { Activity, BarChart3, Coins, Flag, Trophy } from "lucide-react";
import type { PredictionSummary } from "../../../utils/Interfaces/Predictions/predictionSummary";
import PredictionSummaryCard from "../Cards/PredictionSummaryCard";

export interface PredictionSummaryCardsProps {
    summary?: PredictionSummary | null;
}

function formatNumber(value?: number | null) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "—";
    }

    return new Intl.NumberFormat().format(value);
}

export default function PredictionSummaryCards({ summary }: PredictionSummaryCardsProps) {
    return (
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5">
            <PredictionSummaryCard
                label="Wallet"
                value={formatNumber(summary?.wallet_balance)}
                description="Available points"
                icon={Coins}
                tone="accent"
            />
            <PredictionSummaryCard
                label="Bets placed"
                value={formatNumber(summary?.total_bets_placed)}
                description="Prediction slips submitted"
                icon={BarChart3}
                tone="default"
            />
            <PredictionSummaryCard
                label="Markets created"
                value={formatNumber(summary?.total_markets_created)}
                description="Creator-side markets"
                icon={Flag}
                tone="success"
            />
            <PredictionSummaryCard
                label="Open creator markets"
                value={formatNumber(summary?.open_markets_created)}
                description="Approved and running"
                icon={Activity}
                tone="warning"
            />
            <PredictionSummaryCard
                label="Completed participation"
                value={formatNumber(summary?.completed_markets_participated)}
                description="Finished markets joined"
                icon={Trophy}
                tone="danger"
            />
        </div>
    );
}