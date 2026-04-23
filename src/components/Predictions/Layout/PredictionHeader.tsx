import { Button, Card, Spinner } from "@heroui/react";
import { Coins, RefreshCcw, Target } from "lucide-react";

export interface PredictionHeaderProps {
    title?: string;
    subtitle?: string;
    walletBalance?: number | null;
    isLoading?: boolean;
    onRefresh?: () => void;
}

function formatPoints(value?: number | null) {
    if (typeof value !== "number" || Number.isNaN(value)) {
        return "—";
    }

    return new Intl.NumberFormat().format(value);
}

export default function PredictionHeader({
    title = "Predictions",
    subtitle = "Track open markets, manage your bets, and monitor your goal challenges.",
    walletBalance,
    isLoading = false,
    onRefresh,
}: PredictionHeaderProps) {
    return (
        <Card className="border border-default-200 bg-white shadow-sm">
            <div className="flex flex-col gap-5 p-5 lg:flex-row lg:items-center lg:justify-between">
                <div className="min-w-0">
                    <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#5B5EF4]/20 px-3 py-1 text-xs font-semibold text-[#5B5EF4]">
                        <Target className="h-3.5 w-3.5" strokeWidth={2.2} />
                        Predictions dashboard
                    </div>

                    <h1 className="text-3xl font-semibold tracking-tight text-foreground">{title}</h1>
                    <p className="mt-2 max-w-3xl text-sm text-foreground/65">{subtitle}</p>
                </div>

                <div className="flex flex-col gap-3 lg:min-w-[260px] lg:items-end">
                    <div className="flex w-full items-center justify-between rounded-2xl border border-default-200 bg-white px-4 py-3 lg:max-w-[280px]">
                        <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-foreground/45">
                                Wallet balance
                            </p>
                            <div className="mt-1 flex items-center gap-2 text-2xl font-semibold text-foreground">
                                <Coins className="h-5 w-5 text-[#5B5EF4]" strokeWidth={2.2} />
                                {isLoading ? <Spinner size="sm" /> : <span>{formatPoints(walletBalance)}</span>}
                            </div>
                        </div>

                        <div className="rounded-2xl bg-[#5B5EF4]/10 p-3 text-[#5B5EF4]">
                            <Coins className="h-5 w-5" strokeWidth={2.2} />
                        </div>
                    </div>

                    <Button variant="outline" onPress={onRefresh} className="w-full lg:w-auto">
                        <span className="inline-flex items-center gap-2">
                            <RefreshCcw className="h-4 w-4" strokeWidth={2.2} />
                            Refresh data
                        </span>
                    </Button>
                </div>
            </div>
        </Card>
    );
}