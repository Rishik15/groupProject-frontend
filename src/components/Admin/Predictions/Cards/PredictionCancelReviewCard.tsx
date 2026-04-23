import { Button, Card } from "@heroui/react";
import { CircleOff, ShieldCheck } from "lucide-react";
import type { PredictionMarket } from "../../../../utils/Interfaces/Predictions/predictionMarket";

export interface PredictionCancelReviewCardProps {
    market: PredictionMarket;
    isPending?: boolean;
    onApproveCancel: (market: PredictionMarket) => void;
    onRejectCancel: (market: PredictionMarket) => void;
}

export default function PredictionCancelReviewCard({
    market,
    isPending = false,
    onApproveCancel,
    onRejectCancel,
}: PredictionCancelReviewCardProps) {
    return (
        <Card className="rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="space-y-5 p-5">
                <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="space-y-2">
                        <div className="inline-flex rounded-full bg-orange-50 px-3 py-1 text-[11.25px] font-semibold text-orange-700 ring-1 ring-orange-200">
                            Cancel review
                        </div>
                        <div>
                            <h3 className="text-[18.75px] font-semibold text-slate-900">
                                {market.title}
                            </h3>
                            <p className="mt-1 text-[13.125px] text-slate-600">
                                {market.goal_text}
                            </p>
                        </div>
                    </div>
                    <div className="rounded-full bg-slate-50 px-3 py-1 text-[13.125px] font-medium text-slate-600 ring-1 ring-slate-200">
                        Market #{market.market_id}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-[13.125px] text-slate-700">
                    <p className="font-medium text-slate-900">Requested cancellation reason</p>
                    <p className="mt-2">
                        {market.cancel_request_reason || "No cancellation reason provided."}
                    </p>
                </div>

                <div className="flex flex-wrap justify-end gap-3">
                    <Button
                        variant="outline"
                        onPress={() => onRejectCancel(market)}
                        isDisabled={isPending}
                    >
                        <span className="inline-flex items-center gap-2">
                            <CircleOff className="h-4 w-4" />
                            Reject cancellation
                        </span>
                    </Button>
                    <Button
                        onPress={() => onApproveCancel(market)}
                        isDisabled={isPending}
                        className="text-white"
                        style={{ backgroundColor: "#5B5EF4" }}
                    >
                        <span className="inline-flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Approve cancellation
                        </span>
                    </Button>
                </div>
            </div>
        </Card>
    );
}