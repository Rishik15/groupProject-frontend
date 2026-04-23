import { Button, Card } from "@heroui/react";
import {
    CalendarDays,
    Clock3,
    Flag,
    ShieldCheck,
    XCircle,
} from "lucide-react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";

type CreatedMarketCardProps = {
    market: PredictionMarket;
    onCloseMarket?: (market: PredictionMarket) => void;
    onRequestCancel?: (market: PredictionMarket) => void;
};

const formatDate = (value: string | null | undefined): string => {
    if (!value) {
        return "No deadline";
    }

    const parsed = new Date(value);

    if (Number.isNaN(parsed.getTime())) {
        return value;
    }

    return parsed.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
};

const getReviewBadge = (
    reviewStatus: PredictionMarket["review_status"],
): { label: string; className: string } => {
    switch (reviewStatus) {
        case "approved":
            return {
                label: "Approved",
                className:
                    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
            };
        case "rejected":
            return {
                label: "Rejected",
                className:
                    "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
            };
        case "pending":
        default:
            return {
                label: "Pending review",
                className:
                    "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
            };
    }
};

const getLifecycleBadge = (
    status: PredictionMarket["status"],
): { label: string; className: string } => {
    switch (status) {
        case "open":
            return {
                label: "Open",
                className:
                    "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
            };
        case "closed":
            return {
                label: "Pending settlement",
                className:
                    "bg-violet-50 text-violet-700 ring-1 ring-violet-200",
            };
        case "settled":
            return {
                label: "Settled",
                className:
                    "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
            };
        case "cancelled":
            return {
                label: "Cancelled",
                className:
                    "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
            };
        default:
            return {
                label: status,
                className:
                    "bg-slate-100 text-slate-700 ring-1 ring-slate-200",
            };
    }
};

const getCancelBadge = (
    status: PredictionMarket["cancel_request_status"],
): { label: string; className: string } | null => {
    switch (status) {
        case "pending":
            return {
                label: "Cancel review",
                className:
                    "bg-orange-50 text-orange-700 ring-1 ring-orange-200",
            };
        case "approved":
            return {
                label: "Cancel approved",
                className:
                    "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
            };
        case "rejected":
            return {
                label: "Cancel rejected",
                className:
                    "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
            };
        case "none":
        default:
            return null;
    }
};

const canCloseMarket = (market: PredictionMarket): boolean => {
    return (
        (market.review_status) === "approved" &&
        (market.status) === "open" &&
        (market.cancel_request_status) !== "pending"
    );
};

const canRequestCancel = (market: PredictionMarket): boolean => {
    return (
        market.review_status === "approved" &&
        (market.status === "open" || market.status === "closed") &&
        market.settlement_result === null &&
        market.cancel_request_status !== "pending"
    );
};

export default function CreatedMarketCard({
    market,
    onCloseMarket,
    onRequestCancel,
}: CreatedMarketCardProps) {
    const reviewBadge = getReviewBadge(market.review_status);
    const lifecycleBadge = getLifecycleBadge(market.status);
    const cancelBadge = getCancelBadge(market.cancel_request_status);

    const closeEnabled = canCloseMarket(market);
    const cancelEnabled = canRequestCancel(market);

    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="space-y-2 p-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${reviewBadge.className}`}
                            >
                                {reviewBadge.label}
                            </span>

                            <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${lifecycleBadge.className}`}
                            >
                                {lifecycleBadge.label}
                            </span>

                            {cancelBadge ? (
                                <span
                                    className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${cancelBadge.className}`}
                                >
                                    {cancelBadge.label}
                                </span>
                            ) : null}
                        </div>

                        <div>
                            <h3 className="text-xl font-semibold text-slate-900">
                                {market.title}
                            </h3>
                            <p className="mt-2 text-sm text-slate-600">
                                {market.goal_text}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <CalendarDays className="h-4 w-4 text-[#5B5EF4]" />
                            Deadline
                        </div>
                        <p className="text-base font-semibold text-slate-900">
                            {formatDate(market.end_date)}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <Clock3 className="h-4 w-4 text-[#5B5EF4]" />
                            Total points
                        </div>
                        <p className="text-base font-semibold text-slate-900">
                            {market.total_points} pts
                        </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                        <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
                            <Flag className="h-4 w-4 text-[#5B5EF4]" />
                            Total bets
                        </div>
                        <p className="text-base font-semibold text-slate-900">
                            {market.total_bets}
                        </p>
                    </div>
                </div>

                {(market.review_note ||
                    market.settlement_note ||
                    market.cancel_request_reason ||
                    market.cancel_review_note) && (
                        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                            {market.review_note ? (
                                <p>
                                    <span className="font-semibold text-slate-800">
                                        Review note:
                                    </span>{" "}
                                    {market.review_note}
                                </p>
                            ) : null}

                            {market.settlement_note ? (
                                <p className={market.review_note ? "mt-2" : ""}>
                                    <span className="font-semibold text-slate-800">
                                        Settlement note:
                                    </span>{" "}
                                    {market.settlement_note}
                                </p>
                            ) : null}

                            {market.cancel_request_reason ? (
                                <p
                                    className={
                                        market.review_note || market.settlement_note
                                            ? "mt-2"
                                            : ""
                                    }
                                >
                                    <span className="font-semibold text-slate-800">
                                        Cancel reason:
                                    </span>{" "}
                                    {market.cancel_request_reason}
                                </p>
                            ) : null}

                            {market.cancel_review_note ? (
                                <p
                                    className={
                                        market.review_note ||
                                            market.settlement_note ||
                                            market.cancel_request_reason
                                            ? "mt-2"
                                            : ""
                                    }
                                >
                                    <span className="font-semibold text-slate-800">
                                        Cancel review note:
                                    </span>{" "}
                                    {market.cancel_review_note}
                                </p>
                            ) : null}
                        </div>
                    )}

                <div className="flex flex-wrap justify-end gap-3">
                    <Button
                        variant="outline"
                        onPress={() => onRequestCancel?.(market)}
                        isDisabled={!cancelEnabled || !onRequestCancel}
                    >
                        <span className="inline-flex items-center gap-2">
                            <XCircle className="h-4 w-4" />
                            Request cancellation
                        </span>
                    </Button>

                    <Button
                        onPress={() => onCloseMarket?.(market)}
                        isDisabled={!closeEnabled || !onCloseMarket}
                        className="text-white"
                        style={{ backgroundColor: "#5B5EF4" }}
                    >
                        <span className="inline-flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Close market
                        </span>
                    </Button>
                </div>
            </div>
        </Card>
    );
}