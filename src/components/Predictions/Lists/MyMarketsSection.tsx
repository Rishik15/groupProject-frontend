import React from "react";
import { ChevronDown } from "lucide-react";
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

type MarketSectionKey =
    | "inReview"
    | "open"
    | "pending"
    | "closed"
    | "rejected"
    | "cancelReview";

type MarketBlockProps = {
    title: string;
    description: string;
    items: PredictionMarket[];
    isOpen: boolean;
    onToggle: () => void;
    onCloseMarket?: (market: PredictionMarket) => void;
    onRequestCancel?: (market: PredictionMarket) => void;
};

const groupMarkets = (markets: PredictionMarket[]): MarketGroups =>
    markets.reduce<MarketGroups>(
        (accumulator, market) => {
            const cancelStatus = (market.cancel_request_status ?? "").toLowerCase();
            const reviewStatus = (market.review_status ?? "").toLowerCase();
            const marketStatus = (market.status ?? "").toLowerCase();

            if (cancelStatus === "pending") {
                accumulator.cancelReview.push(market);
            } else if (reviewStatus === "pending") {
                accumulator.inReview.push(market);
            } else if (reviewStatus === "rejected") {
                accumulator.rejected.push(market);
            } else if (marketStatus === "open") {
                accumulator.open.push(market);
            } else if (marketStatus === "settled" || marketStatus === "cancelled") {
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
    isOpen,
    onToggle,
    onCloseMarket,
    onRequestCancel,
}: MarketBlockProps) => (
    <section className="space-y-2 rounded-2xl border border-slate-200 bg-white p-4">
        <button
            type="button"
            onClick={onToggle}
            className="flex w-full items-start justify-between gap-3 text-left"
            aria-expanded={isOpen}
        >
            <div>
                <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                <p className="text-[13.125px] text-slate-500">{description}</p>
            </div>

            <div className="flex items-center gap-2">
                <div className="rounded-full bg-slate-100 px-3 py-1 text-[11.25px] font-semibold text-slate-700">
                    {items.length}
                </div>
                <ChevronDown
                    className={`h-4 w-4 text-slate-500 transition-transform ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </div>
        </button>

        {isOpen ? (
            items.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-5 text-[13.125px] text-slate-500">
                    Nothing to show in this section yet.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-2">
                    {items.map((market) => (
                        <CreatedMarketCard
                            key={market.market_id}
                            market={market}
                            onCloseMarket={onCloseMarket}
                            onRequestCancel={onRequestCancel}
                        />
                    ))}
                </div>
            )
        ) : null}
    </section>
);

export default function MyMarketsSection({
    markets,
    onCloseMarket,
    onRequestCancel,
}: MyMarketsSectionProps) {
    const grouped = React.useMemo(() => groupMarkets(markets), [markets]);

    const [openSections, setOpenSections] = React.useState<Record<MarketSectionKey, boolean>>({
        inReview: true,
        open: true,
        pending: true,
        closed: true,
        rejected: true,
        cancelReview: true,
    });

    const toggleSection = (section: MarketSectionKey) => {
        setOpenSections((current) => ({
            ...current,
            [section]: !current[section],
        }));
    };

    return (
        <div className="space-y-3">
            <MarketBlock
                title="In Review"
                description="Markets waiting for admin review."
                items={grouped.inReview}
                isOpen={openSections.inReview}
                onToggle={() => toggleSection("inReview")}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />

            <MarketBlock
                title="Open"
                description="Approved markets open to participation."
                items={grouped.open}
                isOpen={openSections.open}
                onToggle={() => toggleSection("open")}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />

            <MarketBlock
                title="Pending Settlement"
                description="Closed markets waiting for final resolution."
                items={grouped.pending}
                isOpen={openSections.pending}
                onToggle={() => toggleSection("pending")}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />

            <MarketBlock
                title="Closed"
                description="Markets that settled or were cancelled."
                items={grouped.closed}
                isOpen={openSections.closed}
                onToggle={() => toggleSection("closed")}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />

            <MarketBlock
                title="Rejected"
                description="Markets not approved by admin review."
                items={grouped.rejected}
                isOpen={openSections.rejected}
                onToggle={() => toggleSection("rejected")}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />

            <MarketBlock
                title="Cancel Review"
                description="Markets waiting for cancellation review."
                items={grouped.cancelReview}
                isOpen={openSections.cancelReview}
                onToggle={() => toggleSection("cancelReview")}
                onCloseMarket={onCloseMarket}
                onRequestCancel={onRequestCancel}
            />
        </div>
    );
}