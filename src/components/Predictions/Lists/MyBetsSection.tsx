import React from "react";
import type { PredictionBet } from "../../../utils/Interfaces/Predictions/predictionBet";
import MyBetCard from "../Cards/MyBetCard";

type MyBetsSectionProps = {
    bets: PredictionBet[];
    onViewResult?: (bet: PredictionBet) => void;
};

type BetGroups = {
    open: PredictionBet[];
    pending: PredictionBet[];
    closed: PredictionBet[];
};

const groupBets = (bets: PredictionBet[]): BetGroups =>
    bets.reduce<BetGroups>(
        (accumulator, bet) => {
            const status = bet.market_status ?? "";

            if (status === "open") {
                accumulator.open.push(bet);
            } else if (status === "settled" || status === "cancelled") {
                accumulator.closed.push(bet);
            } else {
                accumulator.pending.push(bet);
            }

            return accumulator;
        },
        { open: [], pending: [], closed: [] },
    );

const SectionBlock = ({
    title,
    description,
    items,
    onViewResult,
}: {
    title: string;
    description: string;
    items: PredictionBet[];
    onViewResult?: (bet: PredictionBet) => void;
}) => (
    <section className="space-y-3">
        <div className="flex items-end justify-between gap-4">
            <div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="text-sm text-slate-500">{description}</p>
            </div>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {items.length}
            </div>
        </div>

        {items.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-sm text-slate-500">
                Nothing to show in this section yet.
            </div>
        ) : (
            <div className="space-y-3">
                {items.map((bet) => (
                    <MyBetCard
                        key={bet.prediction_id}
                        bet={bet}
                        onViewResult={onViewResult}
                    />
                ))}
            </div>
        )}
    </section>
);

export default function MyBetsSection({
    bets,
    onViewResult,
}: MyBetsSectionProps) {
    const grouped = React.useMemo(() => groupBets(bets), [bets]);

    return (
        <div className="space-y-8">
            <SectionBlock
                title="Open Bets"
                description="Markets that are still open and actively running."
                items={grouped.open}
                onViewResult={onViewResult}
            />

            <SectionBlock
                title="Pending Bets"
                description="Markets awaiting final settlement."
                items={grouped.pending}
                onViewResult={onViewResult}
            />

            <SectionBlock
                title="Closed Bets"
                description="Markets that settled or were cancelled."
                items={grouped.closed}
                onViewResult={onViewResult}
            />
        </div>
    );
}