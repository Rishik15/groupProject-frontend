import { Button, Card, Modal } from "@heroui/react";
import {
    CalendarDays,
    CheckCircle2,
    Coins,
    Flag,
    Trophy,
    Wallet,
    XCircle,
} from "lucide-react";
import type { PredictionMarket } from "../../../utils/Interfaces/Predictions/predictionMarket";

type CompletedMarketResultModalProps = {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
    market?: PredictionMarket | null;
};

function formatDate(value?: string | null) {
    if (!value) return "Not available";
    const parsed = new Date(value);
    if (Number.isNaN(parsed.getTime())) return value;

    return new Intl.DateTimeFormat(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(parsed);
}

function formatPoints(value?: number | null) {
    return new Intl.NumberFormat().format(value ?? 0);
}

function getResultValue(market?: PredictionMarket | null) {
    if (!market) return null;
    return market.result ?? market.settlement_result ?? (market.status === "cancelled" ? "cancelled" : null);
}

function getResultMeta(result: ReturnType<typeof getResultValue>) {
    if (result === "yes") {
        return {
            label: "Outcome: Yes",
            description: "This market was settled in favor of the YES side.",
            icon: CheckCircle2,
            tone: "bg-emerald-50 text-emerald-700 border-emerald-200",
            iconTone: "text-emerald-600",
        };
    }

    if (result === "no") {
        return {
            label: "Outcome: No",
            description: "This market was settled in favor of the NO side.",
            icon: XCircle,
            tone: "bg-rose-50 text-rose-700 border-rose-200",
            iconTone: "text-rose-600",
        };
    }

    return {
        label: "Outcome: Cancelled",
        description: "This market was cancelled and should be treated as a refunded / void outcome.",
        icon: Flag,
        tone: "bg-amber-50 text-amber-700 border-amber-200",
        iconTone: "text-amber-600",
    };
}

export default function CompletedMarketResultModal({
    isOpen,
    onOpenChange,
    market,
}: CompletedMarketResultModalProps) {
    const resultValue = getResultValue(market);
    const resultMeta = getResultMeta(resultValue);
    const ResultIcon = resultMeta.icon;

    return (
        <Modal>
            <Modal.Backdrop
                isOpen={isOpen}
                onOpenChange={onOpenChange}
                variant="blur"
                isDismissable
            >
                <Modal.Container>
                    <Modal.Dialog className="max-w-3xl rounded-3xl border border-default-200 bg-background shadow-2xl">
                        <Modal.Header className="border-b border-default-200 px-6 py-5">
                            <div className="flex items-start gap-3">
                                <div className="rounded-2xl bg-[#5B5EF4]/10 p-3 text-[#5B5EF4]">
                                    <Trophy className="h-5 w-5" strokeWidth={2.2} />
                                </div>
                                <div>
                                    <h2 className="text-[18.75px] font-semibold tracking-tight text-foreground">Completed market result</h2>
                                    <p className="mt-1 text-[13.125px] text-foreground/60">
                                        Finalized market outcome, settlement context, and pool summary.
                                    </p>
                                </div>
                            </div>
                        </Modal.Header>

                        <Modal.Body className="space-y-5 px-6 py-6">
                            {!market ? (
                                <Card className="border border-dashed border-default-300 bg-content2/40 p-6 text-center shadow-none">
                                    <p className="text-[13.125px] text-foreground/60">No completed market is currently selected.</p>
                                </Card>
                            ) : (
                                <>
                                    <Card className="border border-default-200 shadow-sm">
                                        <div className="space-y-5 p-6">
                                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                                                <div>
                                                    <h3 className="text-[18.75px] font-semibold text-foreground">{market.title}</h3>
                                                    <p className="mt-2 max-w-2xl text-[13.125px] leading-7 text-foreground/65">{market.goal_text}</p>
                                                </div>

                                                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${resultMeta.tone}`}>
                                                    <ResultIcon className={`h-4 w-4 ${resultMeta.iconTone}`} strokeWidth={2.2} />
                                                    {resultMeta.label}
                                                </div>
                                            </div>

                                            <div className="rounded-3xl border border-default-200 bg-content2/50 p-4">
                                                <p className="text-[13.125px] font-semibold text-foreground">Settlement note</p>
                                                <p className="mt-2 text-[13.125px] text-foreground/65">
                                                    {market.settlement_note || market.cancel_review_note || market.review_note || resultMeta.description}
                                                </p>
                                            </div>
                                        </div>
                                    </Card>

                                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                        <Card className="border border-default-200 shadow-sm">
                                            <div className="space-y-4 p-5">
                                                <div className="flex items-center gap-2 text-[13.125px] font-semibold text-foreground">
                                                    <Coins className="h-4 w-4 text-[#5B5EF4]" strokeWidth={2.2} />
                                                    Market totals
                                                </div>

                                                <div className="grid grid-cols-2 gap-3">
                                                    <div className="rounded-2xl bg-content2/50 p-4">
                                                        <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">Total bets</p>
                                                        <p className="mt-2 text-[18.75px] font-semibold text-foreground">{formatPoints(market.total_bets)}</p>
                                                    </div>

                                                    <div className="rounded-2xl bg-content2/50 p-4">
                                                        <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">Total points</p>
                                                        <p className="mt-2 text-[18.75px] font-semibold text-foreground">{formatPoints(market.total_points)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="border border-default-200 shadow-sm">
                                            <div className="space-y-4 p-5">
                                                <div className="flex items-center gap-2 text-[13.125px] font-semibold text-foreground">
                                                    <CalendarDays className="h-4 w-4 text-[#5B5EF4]" strokeWidth={2.2} />
                                                    Timeline
                                                </div>

                                                <div className="space-y-3">
                                                    <div className="rounded-2xl bg-content2/50 p-4">
                                                        <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">Deadline</p>
                                                        <p className="mt-2 text-[13.125px] font-semibold text-foreground">{formatDate(market.end_date)}</p>
                                                    </div>

                                                    <div className="rounded-2xl bg-content2/50 p-4">
                                                        <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">Settled at</p>
                                                        <p className="mt-2 text-[13.125px] font-semibold text-foreground">{formatDate(market.settled_at)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>

                                    <Card className="border border-default-200 shadow-sm">
                                        <div className="space-y-4 p-5">
                                            <div className="flex items-center gap-2 text-[13.125px] font-semibold text-foreground">
                                                <Wallet className="h-4 w-4 text-[#5B5EF4]" strokeWidth={2.2} />
                                                Outcome summary
                                            </div>

                                            <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                                                <div className="rounded-2xl bg-content2/50 p-4">
                                                    <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">Status</p>
                                                    <p className="mt-2 text-[13.125px] font-semibold capitalize text-foreground">{market.status}</p>
                                                </div>

                                                <div className="rounded-2xl bg-content2/50 p-4">
                                                    <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">Review status</p>
                                                    <p className="mt-2 text-[13.125px] font-semibold capitalize text-foreground">{market.review_status}</p>
                                                </div>

                                                <div className="rounded-2xl bg-content2/50 p-4">
                                                    <p className="text-[11.25px] font-medium uppercase tracking-wide text-foreground/55">Result</p>
                                                    <p className="mt-2 text-[13.125px] font-semibold capitalize text-foreground">{resultValue || "Not set"}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                </>
                            )}
                        </Modal.Body>

                        <Modal.Footer className="flex items-center justify-end gap-3 border-t border-default-200 px-6 py-4">
                            <Button variant="outline" onPress={() => onOpenChange(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal.Dialog>
                </Modal.Container>
            </Modal.Backdrop>
        </Modal>
    );
}