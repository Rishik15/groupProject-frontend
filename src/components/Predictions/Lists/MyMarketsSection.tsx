import React from "react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";
import CreatedMarketCard from "../Cards/CreatedMarketCard";

type MyMarketsSectionProps = {
    markets: PredictionMarket[];
    onCloseMarket?: (market: PredictionMarket) => void;
    onRequestCancel?: (market: PredictionMarket) => void;
};

type MarketGroups = {
    inReview: PredictionMarket[];
    open: PredictionMarket[];
    pending: PredictionMarket[];
    closed: PredictionMarket[];
    rejected: PredictionMarket[];
    cancelReview: PredictionMarket[];
};

const groupMarkets = (markets: PredictionMarket[]): MarketGroups =>
    markets.reduce<MarketGroups>(
        (accumulator, market) => {
            if (market.cancel_request_status === "pending") {
                accumulator.cancelReview.push(market);
            } else if (market.review_status === "pending") {
                accumulator.inReview.push(market);
            } else if (market.review_status === "rejected") {
                accumulator.rejected.push(market);
            } else if (market.status === "open") {
                accumulator.open.push(market);
            } else if (market.status === "settled" || market.status === "cancelled") {
                accumulator.closed.push(market);
            } else {
                accumulator.pending.push(market);
            }

            return accumulator;
        },
        {
            inReview: [],
            open: [],
            pending: [],
            closed: [],
            rejected: [],
            cancelReview: [],
        },
    );

const MarketBlock = ({
    title,
    description,
    items,
    onCloseMarket,
    onRequestCancel,
}: {
    title: string;
    description: string;
    items: PredictionMarket[];
    onCloseMarket?: (market: PredictionMarket) => void;
    onRequestCancel?: (market: PredictionMarket) => void;
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
            <div className=" flex grid-cols-2 grid gap-3 h-80">
                {items.map((market) => (
                    <CreatedMarketCard
                        key={market.market_id}
                        market={market}
                        onCloseMarket={onCloseMarket}
                        onRequestCancel={onRequestCancel}
                    />
                ))}
            </div>
        )}
    </section>
);

export default function MyMarketsSection({
    markets,
    onCloseMarket,
    onRequestCancel,
}: MyMarketsSectionProps) {
    const grouped = React.useMemo(() => groupMarkets(markets), [markets]);

    return (
        <div className="grid grid-cols-1 gap-5">
            <MarketBlock
                title="In Review"
                description="Markets waiting for admin review."
                items={grouped.inReview}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />
            <MarketBlock
                title="Open"
                description="Approved markets open to participation."
                items={grouped.open}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />
            <MarketBlock
                title="Pending Settlement"
                description="Closed markets waiting for final resolution."
                items={grouped.pending}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />
            <MarketBlock
                title="Closed"
                description="Markets that settled or were cancelled."
                items={grouped.closed}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />
            <MarketBlock
                title="Rejected"
                description="Markets not approved by admin review."
                items={grouped.rejected}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />
            <MarketBlock
                title="Cancel Review"
                description="Markets waiting for cancellation review."
                items={grouped.cancelReview}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />
        </div>
    );
}