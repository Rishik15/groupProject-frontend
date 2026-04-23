import { Card, Chip } from "@heroui/react";
import {
    CalendarDays,
    Coins,
    TimerReset,
    UserRound,
    Users,
} from "lucide-react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";
import TimeLeftBadge from "../display/TimeLeftBadge";
import PredictionOptionCard from "./PredictionOptionCard";

export interface PredictionMarketCardProps {
    market: PredictionMarket;
    onSelectSide?: (market: PredictionMarket, side: "yes" | "no") => void;
}

function formatDate(value?: string | null) {
    if (!value) {
        return "No deadline";
    }

    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) {
        return "Invalid date";
    }

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(parsed);
}

export default function PredictionMarketCard({
    market,
    onSelectSide,
}: PredictionMarketCardProps) {
    const canBet =
        market.status === "open" &&
        market.review_status === "approved" &&
        new Date(market.end_date).getTime() > Date.now();

    return (
        <Card className="border border-default-200 bg-white shadow-sm">
            <div className="space-y-4 p-5">
                <div className="flex items-start justify-between gap-4">

                    <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground/45">
                            Goal prediction
                        </p>
                        <h3 className="mt-2 line-clamp-2 text-2xl font-semibold tracking-tight text-foreground">
                            {market.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-6 text-foreground/65">
                            {market.goal_text}
                        </p>
                        <TimeLeftBadge endDate={market.end_date} status={market.status} />
                    </div>

                    <div className="rounded-2xl bg-default-50 px-3 py-3">

                        <div className="mb-2 inline-flex rounded-xl bg-[#5B5EF4]/10 p-2 text-[#5B5EF4]">
                            <UserRound className="h-4 w-4" strokeWidth={2.2} />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                            Creator
                        </p>
                        <p className="mt-1 truncate text-sm font-semibold text-foreground">
                            {market.creator_name || market.creator_email}
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-3 grid-cols-3 max-w-[450px]">
                    <div className="rounded-2xl border border-default-200 bg-default-50 px-3 py-3">
                        <div className="mb-2 inline-flex rounded-xl bg-amber-500/10 p-2 text-amber-600">
                            <CalendarDays className="h-4 w-4" strokeWidth={2.2} />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                            Deadline
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                            {formatDate(market.end_date)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-default-200 bg-default-50 px-3 py-3">
                        <div className="mb-2 inline-flex rounded-xl bg-violet-500/10 p-2 text-violet-600">
                            <Coins className="h-4 w-4" strokeWidth={2.2} />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                            Total points
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                            {market.total_points}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-default-200 bg-default-50 px-3 py-3">
                        <div className="mb-2 inline-flex rounded-xl bg-emerald-500/10 p-2 text-emerald-600">
                            <Users className="h-4 w-4" strokeWidth={2.2} />
                        </div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-foreground/45">
                            Total bets
                        </p>
                        <p className="mt-1 text-sm font-semibold text-foreground">
                            {market.total_bets}
                        </p>
                    </div>
                </div>

                <div className="space-y-3 rounded-2xl border border-default-200 bg-default-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <p className="text-sm font-semibold text-foreground">Choose a side</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <PredictionOptionCard
                            side="yes"
                            isDisabled={!canBet}
                            onPress={(side) => onSelectSide?.(market, side)}
                        />
                        <PredictionOptionCard
                            side="no"
                            isDisabled={!canBet}
                            onPress={(side) => onSelectSide?.(market, side)}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );
}